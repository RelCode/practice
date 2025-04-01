import requests
import json
import csv
from concurrent.futures import ThreadPoolExecutor
import threading
import re
import time

class LlmJudge:
    def __init__(self):
        self.rag_response = {}
        self.lock = threading.Lock()
        self.rag_answers = {}
        self.llm_answers = {}
        
    def get_queries(self, filename):
        queries = []
        with open(f"data/{filename}.csv", 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                query = row.get('Query')
                queries.append(query)
        return queries
    
    def run_rag(self, queries):
        with ThreadPoolExecutor(max_workers=1) as executor:
            for key, query in enumerate(queries):
                executor.submit(self.process_query, key, query)
                
    def process_query(self, key, query):
        MAX_RETRIES = 3
        INITIAL_RETRY_DELAY = 2  # seconds
        
        try:
            body = self.create_request_body(query)
            url = "http://localhost:8080/predict"
            headers = {'Content-Type': 'application/json'}
            
            retries = 0
            while retries <= MAX_RETRIES:
                try:
                    response = requests.request("POST", url, headers=headers, data=body, timeout=120)
                    response.raise_for_status()
                    break  # exit loop if request is successful
                except (requests.exceptions.RequestException, requests.exceptions.Timeout) as e:
                    retries += 1
                    if retries > MAX_RETRIES:
                        print(f"Request failed for query {key} after {MAX_RETRIES} retries: {e}")
                        return  # exit when all retries are exhausted
                    
                    retry_delay = INITIAL_RETRY_DELAY * (2 ** (retries - 1))
                    print(f"Request attempt {retries} failed for query {key}: {e}. Retrying in {retry_delay} seconds...")
                    time.sleep(retry_delay)
                
            if not response.text:
                print(f"Empty response for query {key}")
                return
                
            data_objects = []
            
            final_answer = data_objects[-1] if data_objects else None
            if not final_answer:
                print(f"No valid data objects found for query {key}")
                return
                
            message = None
            try:
                message = final_answer["content"]["message"]
            except (KeyError, TypeError):
                print(f"Response missing expected structure for query {key}")
            
            
            with self.lock:
                self.rag_answers[key] = {
                    'answer': final_answer,
                    'status': 'success', # track status in results
                    'message': message
                }
                
            print(f"Query: {query}, Answer: {message}")
            
        except Exception as e:
            print(f"Unexpected error processing query {key}: {e}")
            
    def extract_answer(self, response):
        try:
            pattern = re.compile(r'\{.*?}(?=\s*data:|$)', re.DOTALL)
            matches = pattern.findall(response)
            return matches
        except json.JSONDecodeError:
            print("Failed to decode JSON response")
            return None
            
    @staticmethod
    def create_request_body(query):
        payload = json.dumps({
            "query": query,
            "normalized_query": "",
            "contextual_query": "",
            "metadata": {},
            "streaming": False,
            "is_first_query": True
        })
        return payload
    
    @staticmethod
    def send_request(body):
        try:
            response = requests.post(
                'http://localhost:8080/predict',
                headers={'Content-Type': 'application/json', 'Accept': 'application/json'},
                json=body
            )
            response.raise_for_status()  # Raise an error for bad responses
            return response.text
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None
    
if __name__ == "__main__":
    judge = LlmJudge()
    queries = judge.get_queries("queries")
    judge.run_rag(queries)