from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from pydantic import BaseModel
from datetime import datetime
import json

app = FastAPI()

# Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
    
@app.get("/health")
async def health_check():
    try:
        response = requests.get("http://localhost:11434/api/tags")
        return {"status": "ok", "ollama_available": True, "response": response.json()}
    except:
        return {"status": "error", "message": "Ollama not running"}

class QueryRequest(BaseModel):
    query: str
    response: str

@app.post("/judge")
async def judge_response(request: QueryRequest):
    query = request.query
    response_text = request.response
    current_date = datetime.now().strftime("%B %d, %Y")
    
    print(f"Received query: {query}, Received response: {response_text}, current timestamp: {current_date}")
    
    # Enhanced system prompt with current date
    system_prompt = f"""You are an expert legal and tax law evaluator with the following responsibilities:

    1. Today's date is {current_date}. All evaluations must account for this date when assessing temporal relevance.
    2. You must identify any legal or tax information that appears outdated relative to current laws.
    3. Your evaluations must follow strict legal reasoning principles with minimal personal interpretation.
    4. Every rating must be justified with specific reasoning.
    5. Your response must be valid, properly formatted JSON only, with no preamble or additional text.
    6. You must distinguish between factual errors and potential interpretation differences.

    Evaluation criteria:
    - Relevance (0-10): How directly the response addresses the question
    - Accuracy (0-10): Factual correctness and legal soundness  
    - Completeness (0-10): Coverage of necessary details and considerations
    - Temporal_validity (0-10): Whether the information reflects current laws
    """
    
    prompt = f"""Evaluate the quality of this legal/tax response:
    
    Question: {query}
    Response: {response_text}

    Provide ratings and explanation in JSON format as shown below:
    {{
        "relevance": 0,
        "accuracy": 0,
        "completeness": 0,
        "temporal_validity": 0,
        "overall_score": 0,
        "explanation": "",
        "potential_issues": [],
        "missing_considerations": []
    }}
    """
    
    try:
        # Use stream=False to get a complete response instead of streaming
        ollama_response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "deepseek-llm:7b-chat",
                "prompt": prompt,
                "system": system_prompt,
                "temperature": 0.1,
                "stream": False  # This is the key change
            }
        )
        
        # Check if response is valid and has status code 200
        if ollama_response.status_code != 200:
            return {"error": f"Ollama API returned error code: {ollama_response.status_code}"}
        
        # Process the response
        try:
            ollama_json = ollama_response.json()
            llm_response = ollama_json.get("response", "")
            
            # Try to parse the LLM's response as JSON
            try:
                parsed_json = json.loads(llm_response)
                return {"judge": parsed_json}
            except json.JSONDecodeError:
                return {
                    "judge": llm_response,
                    "warning": "LLM returned malformed JSON",
                    "raw_json_error": "Could not parse LLM output as JSON"
                }
        except Exception as e:
            return {"error": f"Failed to process response: {str(e)}"}
            
    except Exception as e:
        return {"error": f"Request failed: {str(e)}"}

class EvaluatorRequest(BaseModel):
    statement: str


@app.post("/evaluator")
async def evaluator_response(request: EvaluatorRequest):
    statement = request.statement
    system_prompt = f"""You are an AI legal and tax assistant acting as an evaluator. You will receive a legal/tax-related question along with two different AI-generated answers. Your task is to evaluate and compare these answers based on their accuracy, relevance, and legal soundness.

            Please review both answers and provide:

            1. **Correctness** (0–10): Does the answer contain accurate information?
            2. **Completeness** (0–10): Does the answer fully address all parts of the question?
            3. **Source Alignment** (0–10): Does the answer appear grounded in factual, legal, or tax-related context? Avoid hallucinated or fabricated info.
            4. **Legal Soundness** (0–10): Does the answer demonstrate sound legal or tax reasoning, as expected from a compliance advisor?
            5. **Hallucination Risk** (0–10): How likely is it that the answer includes unsupported claims?

            Then provide:

            6. **Commentary**: Describe the strengths and weaknesses of each answer.
            7. **Verdict**: State which answer is better overall (Answer 1 or Answer 2), or say “Equal” if they perform the same.

            Be precise and professional in your reasoning. Avoid vague comments.

            Format your response as follows:
                Question: [The question you received]

                Evaluation:
                - Answer 1: [Detailed explanation of strengths, weaknesses, hallucinations, legal correctness, etc.]
                - Answer 2: [Detailed explanation of strengths, weaknesses, hallucinations, legal correctness, etc.]

                Comparison:
                - Which answer is more correct and legally sound overall? Why?

                Final Verdict:
                - Preferred Answer: Answer 1 or Answer 2
                - Score (Answer 1): X/10
                - Score (Answer 2): Y/10


    """
    
    prompt = f"""
        You are given a legal/tax-related question and two different AI-generated answers.

        {statement}

        Evaluate both answers based on correctness, completeness, legal soundness, alignment with likely legal context, and risk of hallucination. Then rate and compare them accordingly.
    """
    
    try:
        # Use stream=False to get a complete response instead of streaming
        ollama_response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "deepseek-llm:7b-chat",
                "prompt": prompt,
                "system": system_prompt,
                "temperature": 0.1,
                "stream": False  # This is the key change
            }
        )
        
        # Check if response is valid and has status code 200
        if ollama_response.status_code != 200:
            return {"error": f"Ollama API returned error code: {ollama_response.status_code}"}
        
        # Process the response
        try:
            ollama_json = ollama_response.json()
            llm_response = ollama_json.get("response", "")
            
            # Try to parse the LLM's response as JSON
            try:
                parsed_json = json.loads(llm_response)
                return {"evaluation": parsed_json}
            except json.JSONDecodeError:
                return {
                    "evaluation": llm_response,
                    "warning": "LLM returned malformed JSON",
                    "raw_json_error": "Could not parse LLM output as JSON"
                }
        except Exception as e:
            return {"error": f"Failed to process response: {str(e)}"}
            
    except Exception as e:
        return {"error": f"Request failed: {str(e)}"}
