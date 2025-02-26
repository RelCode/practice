from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("This may take some time on first run...")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
print("Model loaded successfully!")

class NewsRequest(BaseModel):
    text: str
    
@app.post("/summarize/")
async def summarize(news: NewsRequest):
    summary = summarizer(news.text, max_length=100, min_length=100, do_sample=False)
    return { "summary": summary[0]['summary_text'] }