# Entry point of the project
import sys
from stack_module import Stack
from queue_module import Queue
from linked_list_module import LinkedList
from utils import Utils

utils = Utils()

def main_menu():
    while(True):
        utils.clear_screen()
        utils.show_info("Main Menu")
        print("1: Stack")
        print("2: Queue")
        print("3: Linked List")

        choice = input("Select Option [or Enter to Exit]: ")

        if (choice == "1"):
            utils.clear_screen()
            stack_menu()
        elif (choice == "2"):
            utils.clear_screen()
            queue_menu()
        elif (choice == "3"):
            utils.clear_screen()
            linked_list_menu()
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
            utils.clear_screen()
            while (True):
                value = input("Enter Value to Push: ")
                if (value != ""):
                    utils.clear_screen()
                    stack.push(value)
                    break
                else:
                    utils.clear_screen()
                    utils.show_error("Value SHOULD NOT be empty")
        elif (choice == "2"):
            utils.clear_screen()
            stack.pop()
        elif (choice == "3"):
            utils.clear_screen()
            stack.view()
        elif (choice == "4"):
            utils.clear_screen()
            stack.peek()
        elif (choice == "5"):
            break
        else:
            utils.clear_screen()
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
            utils.clear_screen()
            while (True):
                value = input("Enter Value to Enqueue: ")
                if (value != ""):
                    utils.clear_screen()
                    queue.enqueue(value)
                    break
                else:
                    utils.clear_screen()
                    utils.show_error("Value SHOULD NOT be empty")
        elif (choice == "2"):
            utils.clear_screen()
            queue.dequeue()
        elif (choice == "3"):
            utils.clear_screen()
            queue.view()
        elif (choice == "4"):
            break
        else:
            utils.clear_screen()
            utils.show_error("Invalid Option")

def linked_list_menu():
    linked_list = LinkedList()
    while (True):
        utils.show_info("Linked List Operations")
        print("1: Insert at Start")
        print("2: Insert at End")
        print("3: Delete Node")
        print("4: View Linked List")
        print("5: Back")

        choice = input("Select Option: ")

        if (choice == "1"):
            utils.clear_screen()
            while (True):
                value = input("Enter Value to Insert at Start: ")
                if (value != ""):
                    utils.clear_screen()
                    linked_list.insert_at_start(value)
                    break
                else:
                    utils.clear_screen()
                    utils.show_error("Value SHOULD NOT be empty")
        elif (choice == "2"):
            utils.clear_screen()
            while (True):
                value = input("Enter Value to Insert at End: ")
                if (value != ""):
                    utils.clear_screen()
                    linked_list.insert_at_end(value)
                    break
                else:
                    utils.clear_screen()
                    utils.show_error("Value SHOULD NOT be empty")
        elif (choice == "3"):
            utils.clear_screen()
            while (True):
                if(linked_list.list_is_empty()):
                    utils.show_error("There's Nothing to Delete")
                    break
                utils.show_info(f"Available Values to Delete: {linked_list.current_list()}")
                value = input("Enter Value to Delete: ")
                if (value != ""):
                    utils.clear_screen()
                    linked_list.delete_node(value)
                    break
                else:
                    utils.clear_screen()
                    utils.show_error("Value SHOULD NOT be empty")
        elif (choice == "4"):
            utils.clear_screen()
            linked_list.view()
        elif (choice == "5"):
            break
        else:
            utils.clear_screen()
            utils.show_error("Invalid Option")
                    

if __name__ == "__main__":
    main_menu()