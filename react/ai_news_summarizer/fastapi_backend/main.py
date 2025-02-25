from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

print("This may take some time on first run...")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
print("Model loaded successfully!")

class NewsRequest(BaseModel):
    text: str
    
@app.post("/summarize/")
async def summarize(news: NewsRequest):
    summary = summarizer(news.text, max_length=100, min_length=15, do_sample=False)
    return { "summary": summary[0]['summary_text'] }