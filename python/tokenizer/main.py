from fastapi import FastAPI
from pydantic import BaseModel
from transformers import BertTokenizer


app = FastAPI()

class PromptRequest(BaseModel):
    prompt: str
    
@app.post("/tokenize/")
async def tokenize(prompt: PromptRequest):
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    token = tokenizer.tokenize(prompt.prompt)
    return { "token": token }