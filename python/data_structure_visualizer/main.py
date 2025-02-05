# Entry point of the project
import sys
from stack_module import Stack
from queue_module import Queue

def main_menu():
    while(True):
        print("Main Menu")
        print("1: Stack")
        print("2: Queue")

        choice = input("Select Option: ")

        if (choice == "1"):
            stack_menu()
        elif (choice == "2"):
            queue_menu()
        else:
            print("Invalid Option")

def stack_menu():
    stack = Stack()
    while (True):
        print("Stack Operations")
        print("1: Push")
        print("2: Pop")
        print("3: View Stack")
        print("4: Peek")
        print("5: Back")

        choice = input("Select Option: ")

        if (choice == "1"):
            while (True):
                value = input("Enter Value to Push: ")
                if (value != ""):
                    stack.push(value)
                    break
                else:
                    print("Value SHOULD NOT be empty")
        elif (choice == "2"):
            stack.pop()
        elif (choice == "3"):
            stack.view()
        elif (choice == "4"):
            stack.peek()
        elif (choice == "5"):
            break
        else:
            print("Invalid Option")

def queue_menu():
    queue = Queue()
    while (True):
        print("Queue Operations")
        print("1: Enqueue")
        print("2: Dequeue")
        print("3: View Queue")
        print("4: Back")

        choice = input("Select Option: ")

        if (choice == "1"):
            while (True):
                value = input("Enter Value to Enqueue: ")
                if (value != ""):
                    queue.enqueue(value)
                    break
                else:
                    print("Value SHOULD NOT be empty")
        elif (choice == "2"):
            queue.dequeue()
        elif (choice == "3"):
            queue.view()
        elif (choice == "4"):
            break
        else:
            print("Invalid Option")

if __name__ == "__main__":
    main_menu()