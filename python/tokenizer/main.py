from fastapi import FastAPI
from pydantic import BaseModel
from transformers import BertTokenizer
from typing import List, Dict


app = FastAPI()

class PromptRequest(BaseModel):
    prompt: str
    
class TokenAnalysis(BaseModel):
    tokens: List[str]
    token_ids: List[int]
    attention_mask: List[int]
    token_type_ids: List[int]
    special_tokens: Dict[str, int]
    
@app.post("/tokenize/")
async def tokenize(prompt: PromptRequest):
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    tokens = tokenizer.tokenize(prompt.prompt)
    
    encoding = tokenizer.encode_plus(
        prompt.prompt,
        add_special_tokens=True,
        padding='max_length',
        max_length=512,
        truncation=True,
        return_attention_mask=True,
        return_token_type_ids=True
    )
    
    special_tokens = {
        'CLS': tokenizer.cls_token_id,
        'SEP': tokenizer.sep_token_id,
        'PAD': tokenizer.pad_token_id,
        'UNK': tokenizer.unk_token_id
    }
    
    return TokenAnalysis(
        tokens=tokens,
        token_ids=encoding['input_ids'],
        attention_mask=encoding['attention_mask'],
        token_type_ids=encoding['token_type_ids'],
        special_tokens=special_tokens
    )