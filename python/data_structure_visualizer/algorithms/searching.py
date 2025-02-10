import math

def linear_search(arr, target):
    print("Linear Search: O(n) Complexity")
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1
    
def binary_search(arr, target):
    print("Binary Search: O(log n) Complexity [Array Must Be Sorted]")
    left, right = 0, len(arr) - 1
    while (left <= right):
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif (arr[mid] < target):
            left = mid + 1
        else:
            right = mid - 1
    return -1

def jump_search(arr, target):
    # array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], target = 8
    print("Jump Search: O(√n) Complexity [Array Must Be Sorted]")
    n = len(arr) # 10
    step = int(math.sqrt(n)) # 3
    prev = 0
    
    while (arr[min(step, n) - 1] < target): # run while step is less than target
        prev = step # 3
        step += int(math.sqrt(n)) # 6
        if (step >= n): # 6 >= 10, False
            return -1 # when step gets bigger than n, it will return -1
        
    for i in range(prev, min(step, n)): 
        if arr[i] == target:
            return i
            
    return -1
            
    

def interpolation_search(arr, target):
    # array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], target = 8
    print("Interpolation Search: O(log log n) Complexity [Array Must Be Sorted and Uniformly Distributed]")
    low, high = 0, len(arr) - 1
    
    while (low <= high and arr[low] <= target <= arr[high]): # check if target is within the array
        if low == high: # if the array has only one element
            if arr[low] == target:
                return low
            return -1
        pos = low + ((target - arr[low]) * (high - low)) // (arr[high] - arr[low]) # interpolation formula
        
        if (arr[pos] == target):
            return pos
        elif (arr[pos] < target):
            low = pos + 1
        else:
            high = pos - 1
            
    return -1