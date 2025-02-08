class Node:
    def __init__ (self, data):
        self.data = data
        self.left = None
        self.right = None

class BinaryTree:
    def __init__ (self):
        self.root = None
        
    def insert (self, data):
        new_node = Node(data)
        if (self.root == None):
            self.root = new_node
            print(f"Node {data} Inserted as Root")
        else:
            self.insert_recursive(self.root, new_node)
            
    def insert_recursive (self, current_node, new_node):
        if (new_node.data < current_node.data):
            if not current_node.left:
                current_node.left = new_node
                print(f"Node {new_node.data} Inserted as Left Child of {current_node.data}")
            else:
                self.insert_recursive(current_node.left, new_node)
        else:
            if not current_node.right:
                current_node.right = new_node
                print(f"Node {new_node.data} Inserted as Right Child of {current_node.data}")
            else:
                self.insert_recursive(current_node.right, new_node)
                
    def inorder_traversal (self):
        print("Inorder Traversal")
        self.inorder_traversal_recursive(self.root)
        print()
        
    def inorder_traversal_recursive (self, current_node):
        if current_node:
            self.inorder_traversal_recursive(current_node.left)
            print(current_node.data, end=" -> ")
            self.inorder_traversal_recursive(current_node.right)
            
    def preorder_traversal (self):
        print("Preorder Traversal")
        self.preorder_traversal_recursive(self.root)
        print()
        
    def preorder_traversal_recursive (self, current_node):
        if current_node:
            print(current_node.data, end=" -> ")
            self.preorder_traversal_recursive(current_node.left)
            self.preorder_traversal_recursive(current_node.right)
            
    def postorder_traversal (self):
        print("Postorder Traversal")
        self.postorder_traversal_recursive(self.root)
        print()
        
    def postorder_traversal_recursive (self, current_node):
        if current_node:
            self.preorder_traversal_recursive(current_node.left)
            self.preorder_traversal_recursive(current_node.right)
            print(current_node.data, end=" -> ")
            
    def search_tree (self, key):
        return self.search_tree_recursive(self.root, key)
    
    def search_tree_recursive (self, current_node, key):
        if (current_node == None):
            print(f"Node {key} NOT Found")
            return False
        if (current_node.data == key):
            print(f"Node {key} Found")
            return True
        if (key < current_node.data):
            return self.search_tree_recursive(current_node.left, key)
        return self.search_tree_recursive(current_node.right, key)
            
            
    
    