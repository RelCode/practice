from fastapi import FastAPI
from pydantic import BaseModel
import torch
from transformers import BertTokenizer, BertModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List

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


@app.post("/tokenize/")
async def tokenize(text: TokenizeRequest):
    print(text.text)
    tokenize = BertTokenizer.from_pretrained("bert-base-uncased")
    tokens = tokenize.tokenize(text.text)
    return {"tokens": tokens}