# AI News Summarizer

A React application demonstrating AI-powered news summarization using multiple backend implementations.

## Project Overview

This project serves as a learning exercise to implement and understand AI endpoints across different programming languages and frameworks. The application allows users to input news articles (via URL or text) and receive AI-generated summaries.

## Backend Implementations

The project includes three different backend API endpoints:

1. **FastAPI (Python)**
    - Uses a local HuggingFace model for summarization
    - Start server: `uvicorn main:app --reload`

2. **Node.js**
    - Integrates with OpenAI API
    - Handles summarization requests through REST endpoints

3. **.NET Core Web API**
    - Integrates with OpenAI API
    - Provides REST endpoints for summarization

## Features

- Multiple backend options for AI summarization
- Support for both URL and direct text input
- Backend selection through the UI
- TypeScript-based React frontend
- Error handling and response management

## Purpose

The main objectives of this project are:
- Demonstrate AI implementation across different programming languages
- Understand core concepts of AI integration
- Compare different backend approaches
- Reinforce AI development knowledge

## Usage

1. Start at least one backend service from the backend project folders
2. Run the React application
3. Select desired backend endpoint
4. Input news article (URL or text)
5. Receive AI-generated summary
