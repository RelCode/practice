# Entry point of the project
import sys
from stack_module import Stack
from queue_module import Queue
from linked_list_module import LinkedList
from tree_module import BinaryTree
from utils import Utils

utils = Utils()

def main_menu():
    while(True):
        utils.clear_screen()
        utils.show_info("Main Menu")
        print("1: Stack")
        print("2: Queue")
        print("3: Linked List")
        print("4: Binary Tree")
        print("5: Sorting")
        print("6: Searching")

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
        elif (choice == "4"):
            utils.clear_screen()
            binary_tree_menu()
        elif (choice == "5"):
            utils.clear_screen()
            sorting_algorithm_menu()
        elif (choice == "6"):
            utils.clear_screen()
            searching_algorithms_menu()
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
            
def binary_tree_menu():
    binary_tree = BinaryTree()
    while True:
        utils.show_info("Binary Tree Operations")
        print("1: Insert Node")
        print("2: Inorder Traversal")
        print("3: Preorder Traversal")
        print("4: Postorder Traversal")
        print("5: Search Tree")
        print("6: Back")
        
        choice = input("Select Option: ")
        
        if (choice == "1"):
            utils.clear_screen()
            while True:
                value = input("Enter Value to Insert: ")
                if (value != ""):
                    utils.clear_screen()
                    binary_tree.insert(value)
                    break
                else:
                    utils.clear_screen()
                    utils.show_error("Value SHOULD NOT be empty")
        elif (choice == "2"):
            utils.clear_screen()
            binary_tree.inorder_traversal()
        elif (choice == "3"):
            utils.clear_screen()
            binary_tree.preorder_traversal()
        elif (choice == "4"):
            utils.clear_screen()
            binary_tree.postorder_traversal()
        elif (choice == "5"):
            utils.clear_screen()
            while True:
                value = input("Enter Node to Search: ")
                if (value != ""):
                    utils.clear_screen()
                    binary_tree.search_tree(value)
                    break
                else:
                    utils.clear_screen()
                    utils.show_error("Value SHOULD NOT be empty")
        elif (choice == "6"):
            break
        else:
            utils.clear_screen()
            utils.show_error("Invalid Option")
            
            
def sorting_algorithm_menu():
    while (True):
        utils.show_info("Sorting Algorithms")
        arr = [64, 34, 25, 12, 22, 11, 90]
        print("1: Bubble Sort")
        print("2: Selection Sort")
        print("3: Insertion Sort")
        print("4: Quick Sort")
        print("5: Merge Sort")
        print("6: Back")
        
        choice = input("Select Option: ")
        
        if (choice in ["1", "2", "3", "4", "5"]):
            utils.clear_screen()
            utils.show_warning(f"Original Array: {arr}")
            if (choice == "1"):
                from algorithms.sorting import bubble_sort
                utils.show_success(f"Bubble Sorted Array: {bubble_sort(arr)}")
            elif (choice == "2"):
                from algorithms.sorting import selection_sort
                utils.show_success(f"Selection Sorted Array: {selection_sort(arr)}")
            elif (choice == "3"):
                from algorithms.sorting import insertion_sort
                utils.show_success(f"Insertion Sorted Array: {insertion_sort(arr)}")
            elif (choice == "4"):
                from algorithms.sorting import quick_sort
                utils.show_success(f"Quick Sorted Array: {quick_sort(arr)}")
            elif (choice == "5"):
                from algorithms.sorting import merge_sort
                utils.show_success(f"Merge Sorted Array: {merge_sort(arr)}")
        elif (choice == "6"):
            break
        else:
            utils.clear_screen()
            utils.show_error("Invalid Option")
            
def searching_algorithms_menu():
    while (True):
        utils.show_info("Searching Algorithms")
        arr = [64, 34, 25, 12, 22, 11, 90]
        print("1: Linear Search")
        print("2: Binary Search")
        print("3: Jump Search")
        print("4: Interpolation Search")
        print("5: Back")
        
        choice = input("Select Option: ")
        
        if (choice in ["1", "2", "3", "4"]):
            utils.clear_screen()
            utils.show_info(f"Array: {arr}")
            value = int(input("Enter Value to Search from List above: "))
            if (choice == "1"):
                from algorithms.searching import linear_search
                result = linear_search(arr, value)
            elif (choice == "2"):
                from algorithms.searching import binary_search
                result = binary_search(arr, value)
            elif (choice == "3"):
                from algorithms.searching import jump_search
                result = jump_search(arr, value)
            elif (choice == "4"):
                from algorithms.searching import interpolation_search
                result = interpolation_search(arr, value)
            utils.clear_screen()
            if (result >= 0):
                utils.show_success(f"{value} found at index {result}")
            else:
                utils.show_error(f"{value} not found")
        elif (choice == "5"):
            break
        else: 
            utils.clear_screen()
            utils.show_error("Invalid Option")
         
if __name__ == "__main__":
    main_menu()