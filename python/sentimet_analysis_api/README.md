# Sentiment Analysis API Project

## Overview
This project implements a sentiment analysis system using machine learning techniques. It's designed as a practical application to demonstrate core concepts in AI development, combining data handling, machine learning, and API development.

## Technologies Used
- **Python**: Primary programming language
- **Pandas**: Data manipulation and analysis
- **Scikit-learn**: Machine learning implementation
- **FastAPI**: API framework
- **Uvicorn**: ASGI server implementation

## Features
- Data processing from CSV files
- Sentiment analysis using machine learning models
- RESTful API endpoints for real-time analysis
- Scalable architecture for handling multiple requests

## Project Structure
```
sentiment_analysis_api/
├── data/            # CSV and data files
├── model/           # ML model files
├── main.py          # Main application
|-- model.py         # Contains actual model functions
├── requirements.txt # for all the required packages
└── README.md
```

## Setup and Installation
1. Clone the repository
2. Install dependencies:
```bash
pip install -r requirements.txt
```
3. Run the application:
```bash
uvicorn main:app --reload
```

## API Usage
The API will provide endpoints for:
- Sentiment analysis of text input
- Model training status
- Analysis results retrieval

## Development Goals
- Implement robust data preprocessing
- Build and train ML models
- Create RESTful API endpoints
