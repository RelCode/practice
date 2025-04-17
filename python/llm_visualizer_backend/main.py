from fastapi import FastAPI
from pydantic import BaseModel
import torch
import torch.nn.functional as F
from transformers import BertTokenizer, BertModel, BertForMaskedLM
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pprint import pprint
from sklearn.manifold import TSNE
import numpy as np

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
    # Load model and tokenizer
    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
    model = BertForMaskedLM.from_pretrained("bert-base-uncased")
        
    # Prepare input with mask token for next token prediction
    masked_text = request.text.strip() + " " + tokenizer.mask_token
        
    # Tokenize the input
    inputs = tokenizer(masked_text, return_tensors="pt")
        
    # Find the position of the [MASK] token
    mask_token_index = torch.where(inputs["input_ids"] == tokenizer.mask_token_id)[1]
        
    # Forward pass
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        
    # Get predictions for the mask token
    mask_logits = logits[0, mask_token_index, :].squeeze()
        
    # Get the top predicted tokens
    topk_values, topk_indices = torch.topk(mask_logits, k=10)
        
    # Convert to probabilities using softmax
    probabilities = F.softmax(topk_values, dim=0).tolist()
        
    # Get the corresponding tokens
    topk_tokens = [tokenizer.decode([idx.item()]).strip() for idx in topk_indices]
        
    # Prepare the response
    top_tokens = [
        {"token": token, "probability": float(prob)} 
        for token, prob in zip(topk_tokens, probabilities)
    ]
        
    return {
        "topTokens": top_tokens,
        "selectedToken": top_tokens[0]["token"] if top_tokens else ""
    }