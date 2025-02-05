# Entry point of the project
import sys
from stack_module import Stack
from queue_module import Queue
from utils import Utils

utils = Utils()

def main_menu():
    while(True):
        utils.clear_screen()
        utils.show_info("Main Menu")
        print("1: Stack")
        print("2: Queue")

        choice = input("Select Option [or Enter to Exit]: ")

        if (choice == "1"):
            utils.clear_screen()
            stack_menu()
        elif (choice == "2"):
            utils.clear_screen()
            queue_menu()
        elif (choice == ""):
            sys.exit()
        else:
            print("Invalid Option")

def stack_menu():
    stack = Stack()
    while (True):
        utils.show_info("Stack Operations")
        print("1: Push")
        print("2: Pop")
        print("3: View Stack")
        print("4: Peek")
        print("5: Back")

        choice = input("Select Option: ")

        if (choice == "1"):
            while (True):
                utils.clear_screen()
                value = input("Enter Value to Push: ")
                if (value != ""):
                    stack.push(value)
                    break
                else:
                    utils.show_error("Value SHOULD NOT be empty")
        elif (choice == "2"):
            stack.pop()
        elif (choice == "3"):
            stack.view()
        elif (choice == "4"):
            stack.peek()
        elif (choice == "5"):
            break
        else:
            utils.clear_screen("Invalid Option")

def queue_menu():
    queue = Queue()
    while (True):
        utils.show_info("Queue Operations")
        print("1: Enqueue")
        print("2: Dequeue")
        print("3: View Queue")
        print("4: Back")

        choice = input("Select Option: ")

        if (choice == "1"):
            while (True):
                utils.clear_screen()
                value = input("Enter Value to Enqueue: ")
                if (value != ""):
                    queue.enqueue(value)
                    break
                else:
                    utils.show_error("Value SHOULD NOT be empty")
        elif (choice == "2"):
            queue.dequeue()
        elif (choice == "3"):
            queue.view()
        elif (choice == "4"):
            break
        else:
            utils.show_error("Invalid Option")

if __name__ == "__main__":
    main_menu()