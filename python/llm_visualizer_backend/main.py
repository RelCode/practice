from fastapi import FastAPI
from pydantic import BaseModel
import torch
import torch.nn.functional as F
from transformers import BertTokenizer, BertModel, GPT2LMHeadModel, GPT2Tokenizer
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pprint import pprint
from sklearn.manifold import TSNE
import numpy as np
from typing import List, Dict, Any
import random
from pydantic import BaseModel

app = FastAPI()

# Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TokenizeRequest(BaseModel):
    text: str
    
class EmbeddingsRequest(BaseModel):
    tokens: List[str]
    
class VisualizeRequest(BaseModel):
    tokens: List[str]


@app.post("/tokenize/")
async def tokenize(text: TokenizeRequest):
    print(text.text)
    tokenize = BertTokenizer.from_pretrained("bert-base-uncased")
    tokens = tokenize.tokenize(text.text)
    return { "tokens": tokens }

@app.post("/embeddings/")
async def embeddings(tokens: EmbeddingsRequest):
    model = BertModel.from_pretrained("bert-base-uncased")
    embeddedVectors = []
    for token in tokens.tokens:
        pprint(token)
        tokenize = BertTokenizer.from_pretrained("bert-base-uncased")
        input_ids = torch.tensor([tokenize.convert_tokens_to_ids([token])])
        with torch.no_grad():
            embeddings = model(input_ids)
            embeddedVectors.append({ "token": token, "vectors": embeddings[0].tolist() })
    return { "embeddings": embeddedVectors }
    
class AttentionRequest(BaseModel):
    text: str

@app.post("/attention")
async def get_attention(request: AttentionRequest):
    # Load model and tokenizer
    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
    model = BertModel.from_pretrained("bert-base-uncased", output_attentions=True)
        
    # Tokenize input
    inputs = tokenizer(request.text, return_tensors="pt")
    tokens = tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])
        
    # Run through model and get attention
    with torch.no_grad():
        outputs = model(**inputs)
        
    # Extract attention weights
    # Format as [layer][head][from_token][to_token]
    attention_data = []
    for layer_attention in outputs.attentions:
        # Remove batch dimension (we only have 1 batch)
        layer_attention = layer_attention.squeeze(0)
        layer_data = layer_attention.tolist()
        attention_data.append(layer_data)
    
    return {
        "tokens": tokens,
        "attention": attention_data
    }
    
    

class TokenPredictionRequest(BaseModel):
    text: str

@app.post("/token-predictions")
async def token_predictions(request: TokenPredictionRequest):
    print(f"Received text for token prediction: {request.text}")
    # Load GPT-2 model and tokenizer
    tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
    model = GPT2LMHeadModel.from_pretrained("gpt2")
    
    # Add padding token if needed
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    
    # Encode input text
    inputs = tokenizer(request.text.strip(), return_tensors="pt")
    
    # Get next token prediction
    with torch.no_grad():
        outputs = model(**inputs)
        next_token_logits = outputs.logits[0, -1, :]
    
    # Get top k tokens
    topk_values, topk_indices = torch.topk(next_token_logits, k=10)
    
    # Apply softmax for probabilities
    probabilities = F.softmax(topk_values, dim=0).tolist()
    
    # Get the corresponding tokens (clean up whitespace for display)
    topk_tokens = [tokenizer.decode([idx.item()]).strip() for idx in topk_indices]
    
    # Prepare response
    top_tokens = [
        {"token": token if token else "[space]", "probability": float(prob)} 
        for token, prob in zip(topk_tokens, probabilities)
    ]
    
    return {
        "topTokens": top_tokens,
        "selectedToken": top_tokens[0]["token"] if top_tokens else ""
    }
    
    
class GenerationRequest(BaseModel):
    prompt: str
    temperature: float = 0.7
    top_p: float = 0.9
    top_k: int = 40
    max_tokens: int = 30
    sampling_strategy: str = "nucleus"

@app.post("/generate")
async def generate_text(request: GenerationRequest):
    print(f"Generating text for prompt: {request.prompt}")
        
    # Load GPT-2 model and tokenizer
    tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
    model = GPT2LMHeadModel.from_pretrained("gpt2", output_attentions=True, output_hidden_states=True)
        
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
        
    # Tokenize input prompt
    input_ids = tokenizer.encode(request.prompt, return_tensors="pt")
    prompt_length = len(input_ids[0])
        
    # Generate tokens
    generated_tokens = []
    past = None
    current_input = input_ids
        
    for _ in range(request.max_tokens):
        with torch.no_grad():
            outputs = model(
                input_ids=current_input,
                past_key_values=past,
                output_attentions=True,
                output_hidden_states=True
            )
            past = outputs.past_key_values
            next_token_logits = outputs.logits[0, -1, :]
                
            # Apply sampling strategy
            if request.sampling_strategy == "greedy":
                next_token_id = torch.argmax(next_token_logits).unsqueeze(0)
            else:
                # Apply temperature
                next_token_logits = next_token_logits / (request.temperature if request.temperature > 0 else 1.0)
                    
                # Apply top-k if needed
                if request.sampling_strategy == "topk":
                    top_k = min(request.top_k, next_token_logits.size(-1))
                    indices_to_remove = next_token_logits < torch.topk(next_token_logits, top_k)[0][..., -1, None]
                    next_token_logits[indices_to_remove] = -float('Inf')
                    
                # Apply top-p if needed
                if request.sampling_strategy == "nucleus":
                    sorted_logits, sorted_indices = torch.sort(next_token_logits, descending=True)
                    cumulative_probs = torch.cumsum(F.softmax(sorted_logits, dim=-1), dim=-1)
                    sorted_indices_to_remove = cumulative_probs > request.top_p
                    sorted_indices_to_remove[..., 1:] = sorted_indices_to_remove[..., :-1].clone()
                    sorted_indices_to_remove[..., 0] = 0
                    indices_to_remove = sorted_indices_to_remove.scatter(
                        dim=-1, index=sorted_indices, src=sorted_indices_to_remove
                    )
                    next_token_logits[indices_to_remove] = -float('Inf')
                    
                # Sample from the distribution
                probs = F.softmax(next_token_logits, dim=-1)
                next_token_id = torch.multinomial(probs, num_samples=1)
                
            # Prepare for next iteration
            current_input = next_token_id.unsqueeze(0)
                
            # Get token information
            token = tokenizer.decode(next_token_id)
                
            # Get top 5 candidates
            topk_values, topk_indices = torch.topk(outputs.logits[0, -1, :], k=10)
            topk_probs = F.softmax(topk_values, dim=0).tolist()
            top_candidates = [
                {"token": tokenizer.decode(idx.item()), "probability": prob} 
                for idx, prob in zip(topk_indices, topk_probs)
            ]
                
            # Get the probability of the selected token
            token_prob = F.softmax(next_token_logits, dim=-1)[next_token_id].item()
                
            # Extract attention patterns (simplified)
            attention = []
            for layer_idx in range(len(outputs.attentions)):
                layer_attention = []
                for head_idx in range(outputs.attentions[layer_idx].size(1)):
                    head_attention = outputs.attentions[layer_idx][0, head_idx, -1, :].tolist()
                    layer_attention.append(head_attention)
                attention.append(layer_attention)
                
            # Extract hidden states (simplified)
            hidden_states = [
                outputs.hidden_states[-1][0, -1, :50].tolist(),
                outputs.hidden_states[-1][0, -1, 50:100].tolist()
            ]
                
            token_data = {
                "token": token,
                "probability": token_prob,
                "topCandidates": top_candidates,
                "attention": attention,
                "hiddenStates": hidden_states
            }
                
            generated_tokens.append(token_data)
        
    # Create simplified attention scores for context visualization
    attention_scores = []
    for i in range(len(generated_tokens)):
        # Simulate attention scores for each token position
        scores = [random.random() for _ in range(prompt_length + i)]
        attention_scores.append(scores)
        
    return {
        "prompt": request.prompt,
        "generatedTokens": generated_tokens,
        "samplingInfo": {
            "strategy": request.sampling_strategy,
            "temperature": request.temperature,
            "topP": request.top_p,
            "topK": request.top_k
        },
        "contextUsage": {
            "tokenPositions": list(range(prompt_length)),
            "attentionScores": attention_scores
        }
    }