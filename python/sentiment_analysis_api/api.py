import os
import logging
from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from model import sentiment_model
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI()

Instrumentator().instrument(app).expose(app)

if not os.path.exists("logs"):
    os.mkdir("logs")
    try:
        with open("logs/api.log", "w") as f:
            f.write("")
    except:
        Exception("Error creating log file")
        exit(1)

# configure logging
logging.basicConfig(
    filename="logs/api.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)


class TextRequest(BaseModel):
    text: str


class BatchTextRequest(BaseModel):
    texts: list[str]

@app.get("/")
def home():
    return { "message": "Sentiment Analyzer API" }

@app.post("/predict/")
def predict_sentiment(request: TextRequest):
    start_time = datetime.now()
    sentiment = sentiment_model.predict([request.text])[0]
    end_time = datetime.now()
    response_time = (end_time - start_time).total_seconds()
    logging.info(f"Sentiment: {sentiment}, Response Time: {response_time}")
    return { "message": sentiment, "response_time": response_time }

@app.post("/predict-batch/")
def predict_sentiments(request: BatchTextRequest):
    start_time = datetime.now()
    sentiments = sentiment_model.predict(request.texts).tolist()
    results = list()
    count: int = 0
    for sentiment in sentiments:
        s = { "text": request.texts[count], "sentiment": sentiment }
        results.append(s)
        count += 1
    end_time = datetime.now()
    response_time = (end_time - start_time).total_seconds()
    logging.info(f"Response Time: {response_time}")
    return {"results": results, "response_time": response_time}