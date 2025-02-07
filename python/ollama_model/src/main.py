from src.chat import Llama_Chat
import os
import unittest

def main():
    if (os.name == "nt"):
        os.system("cls")
        
    print("Llama Chatbot - Type 'exit' to quit")
    
    chat = Llama_Chat()
    messages = []
    
    while (True):
        print('\033[94m')
        user_input = input("You: ")
        print('\033[0m')
        
        if (user_input == ""):
            print("Llama: Please enter a message")
            continue
        elif (user_input.lower() in ["exit","quit"]):
            print("Llama: Goodbye!")
            break
        
        messages.append({"role":"user","content": user_input})
        response = chat.getResponse(messages)
        messages.append({"role":"assistant","content": response})
        print("Llama: " + response)
        
if __name__ == "__main__":
    main()

        
        