class Stack:
    def __init__(self):
        self.stack = []

    def push(self, value):
        self.stack.append(value)
        print(f"{value} pushed to stack")

    def pop(self):
        if not self.is_empty():
            removed = self.stack.pop()
            print(f"{removed} popped from Stack")
        else:
            print("Stack is Empty")

    def peek(self):
        if not self.is_empty():
            print(f"Last element = {self.stack[-1]}")
        else:
            print("Stack is Empty")

    def view(self):
        if self.stack:
            print("Stack: " + " -> ".join(self.stack[::-1]))

    def is_empty(self):
        return len(self.stack) == 0