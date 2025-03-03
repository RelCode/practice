from transformers import BertTokenizer

class PromptTokenizer:
    def __init__(self):
        self.prompt = ""
        
    def setPrompt(self, prompt):
        self.prompt = prompt
        
    def tokenize(self):
        tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        tokens = tokenizer.tokenize(self.prompt)
        return tokens
        
    
        
promptTokenizer = PromptTokenizer()
promptTokenizer.setPrompt("this here will be the prompt we want tokenized")
tokens = promptTokenizer.tokenize()
print(f"Tokens: {tokens}")