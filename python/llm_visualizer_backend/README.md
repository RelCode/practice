# LLM Visualizer Backend

A FastAPI-based backend service for the LLM Visualizer React application.

## Overview

This Python backend service provides API endpoints for processing and analyzing Large Language Model (LLM) related tasks, including:
- Tokenization of user prompts
- Embedding generation
- Data visualization support

## Features

- RESTful API endpoints using FastAPI
- Swagger UI documentation
- Token analysis
- Embedding generation
- Integration with LLM Visualizer frontend

## Setup

1. Install dependencies:
```bash
pip install fastapi uvicorn transformers torch
```

2. Run the server:
```bash
uvicorn main:app --reload
```

The API documentation will be available at `http://localhost:8000/docs`

## API Usage

Detailed API documentation is available through the Swagger UI interface.

## Requirements

- Python 3.7+
- FastAPI
- Uvicorn
- Additional dependencies listed in requirements.txt