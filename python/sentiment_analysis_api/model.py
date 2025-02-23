import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

# load dataset
def load_data():
    try:
        df = pd.read_csv("data/sentiment_data.csv")
    except:
        Exception("Error loading dataset")
        exit(1)
    return df["text"], df["label"]

# train model
def train_model():
    x, y = load_data()

    model = Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,2))), # converts text into numerical form
        ("classifier", MultinomialNB()) # train model using a simple algorithm for text classification
    ])

    # train model
    model.fit(x, y)

    return model

# analyze trained model
sentiment_model = train_model()