class Node:
    def __init__ (self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__ (self):
        self.head = None

    def insert_at_end (self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
        else:
            temp = self.head
            while temp.next:
                temp = temp.next
            temp.next = new_node # last node set to None will take the new data
        print(f"{data} inserted at end")
    
    def insert_at_start (self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
        print(f"{data} inserted at start")

    def delete_node (self, value):
        temp = self.head
        if (temp.data == value):
            self.head = temp.next
            temp = None
            print(f"{value} deleted")
            return
        
        prev = None
        while temp and temp.data != value:
            prev = temp
            temp = temp.next

        if not temp:
            print(f"{value} not found")
            return
        
        prev.next = temp.next
        temp = None
        print(f"{value} deleted")

            

    def view (self):
        if not self.head:
            print("List is Empty")
            return
        else:
            temp = self.head
            while temp:
                lastChar = "\n" if temp.next == None else " -> "
                print(temp.data, end=lastChar)
                temp = temp.next

    def list_is_empty (self):
        return self.head == None
    
    def current_list (self):
        current_list = []
        temp = self.head
        while temp:
            current_list.append(temp.data)
            temp = temp.next
        return current_list
            
                