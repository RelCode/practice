from ollama import chat
from .config import (
    OLLAMA_MODEL
)

class Llama_Chat:
    def getResponse (self, messages):
        response = chat(
            model=OLLAMA_MODEL,
            messages=messages
        )
        return response.message.content