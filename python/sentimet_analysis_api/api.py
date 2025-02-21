from fastapi import FastAPI
from pydantic import BaseModel
from model import sentiment_model

app = FastAPI()


class TextRequest(BaseModel):
    text: str


class BatchTextRequest(BaseModel):
    texts: list[str]

@app.get("/")
def home():
    return { "message": "Sentiment Analyzer API" }

@app.post("/predict/")
def predict_sentiment(request: TextRequest):
    sentiment = sentiment_model.predict([request.text])[0]
    print("Sentiment: " +sentiment)
    return { "message": sentiment }

@app.post("/predict-batch")
def predict_sentiments(request: BatchTextRequest):
    sentiments = sentiment_model.predict([request.texts]).tolist()
    return {"results": [{"text": txt, "sentiment": sent} for txt, sent in zip(request.texts, sentiments)]}