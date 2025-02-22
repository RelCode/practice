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
    return { "message": sentiment }

@app.post("/predict-batch/")
def predict_sentiments(request: BatchTextRequest):
    sentiments = sentiment_model.predict(request.texts).tolist()
    results = list()
    count: int = 0
    for sentiment in sentiments:
        s = { "text": request.texts[count], "sentiment": sentiment }
        results.append(s)
        count += 1
    return {"results": results}