from fastapi import FastAPI
import torch
from transformers import pipeline
from pydantic import BaseModel

app = FastAPI()

# load local model
model = None
tokenizer = None

@app.on_event("startup")
async def startup_event():
    global pipe
    pipe = pipeline("text-generation", model="", torch_dtype=torch.float16, device_map="auto")
    
@app.get("/health")
async def health_check():
    print("Health check")
    return {"status": "Ok", "model": model is not None}

class QueryRequest(BaseModel):
    query: str
    response: str

@app.post("/judge")
async def judge_response(request: QueryRequest):
    print("Judge response")
    query = request.query
    response = request.response
    print(f"Query: {query}")
    if not query or not response:
        return {"error": "Query and response must be provided."}
    
    print(f"Response: {response}")
    
    prompt = f"""
    You are an expert evaluator. Assess the quality of the following response to the provided question:
    
    Question: {query}
    Response: {response}
    
    Rate the response on:
    1. Relevance (0-10)
    2. Accuracy (0-10)
    3. Completeness (0-10)
    
    Provide your rating and a brief explanation for each rating in a JSON format:
    {{
        "relevance": 0,
        "accuracy": 0,
        "completeness": 0,
        "explanation": ""
    }}
    """
    
    print(prompt)
    
    # inputs = tokenizer(prompt, return_tensors="pt")
    # outputs = model.generate(**inputs, max_length=1024)
    # generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    messages = [
        {"role": "user", "content": prompt}
    ]
    userPrompt = pipe.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    outputs = pipe(prompt, max_new_tokens=256, do_sample=False)
    
    return {"judge": outputs[0]['generated_text']}
