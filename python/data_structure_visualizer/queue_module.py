class Queue:
    def __init__(self):
        self.queue = []

    def enqueue(self, value):
        self.queue.append(value)
        print(f"{value} enqueued to queue")

    def dequeue(self):
        removed = self.queue.pop(0)
        print(f"{removed} dequeued from queue")

    def view(self):
        if self.queue:
            print("Queue: " + " -> ".join(self.queue))
        else:
            print("Queue is Empty")