from fastapi import FastAPI
from pydantic import BaseModel
import torch
from transformers import BertTokenizer, BertModel
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
    model = BertModel.from_pretrained("bert-base-uncased")
    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
    
    # Get embeddings for all tokens
    all_embeddings = []
    
    for token in request.tokens:
        input_ids = torch.tensor([tokenizer.convert_tokens_to_ids([token])])
        with torch.no_grad():
            outputs = model(input_ids)
            # Get token embedding from the last hidden state
            embedding = outputs.last_hidden_state.squeeze().numpy()
            all_embeddings.append(embedding)
    
    # Stack all embeddings
    embeddings_array = np.vstack(all_embeddings)
    
    # Apply t-SNE for 2D visualization
    tsne = TSNE(n_components=2, perplexity=min(30, len(request.tokens)-1) if len(request.tokens) > 1 else 1)
    embeddings_2d = tsne.fit_transform(embeddings_array).tolist()
    
    # Add similar words to create context (optional)
    context_words = ["the", "a", "in", "is", "and", "to", "of", "for", "with", "on"]
    context_embeddings = []
    
    # Only add context if we have a small number of tokens
    if len(request.tokens) < 5:
        for word in context_words:
            if word not in request.tokens:
                input_ids = torch.tensor([tokenizer.convert_tokens_to_ids([word])])
                with torch.no_grad():
                    outputs = model(input_ids)
                    embedding = outputs.last_hidden_state.squeeze().numpy()
                    context_embeddings.append(embedding)
        
        if context_embeddings:
            context_array = np.vstack(context_embeddings)
            all_array = np.vstack([embeddings_array, context_array])
            combined_2d = tsne.fit_transform(all_array).tolist()
            
            return {
                "tokens": request.tokens + context_words[:len(context_embeddings)],
                "coordinates": combined_2d,
                "user_tokens": len(request.tokens)
            }
    
    return {
        "tokens": request.tokens,
        "coordinates": embeddings_2d
    }
    
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