def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr

def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_index = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_index]:
                min_index = j
        arr[i], arr[min_index] = arr[min_index], arr[i]
    return arr

def insertion_sort(arr):
    # [3, 2, 7, 6, 1]
    for i in range(1, len(arr)): # i == 1
        key = arr[i] # 2
        j = i - 1 # 0
        while j >= 0 and key < arr[j]: # 2 < 3
            arr[j + 1] = arr[j] # [3, 3, 7, 6, 1]
            j -= 1 # -1
        arr[j + 1] = key   # [2, 3, 7, 6, 1]
    return arr  # [1, 2, 3, 6, 7]

def merge_sort(arr):
    # [64, 34, 25, 12, 22, 11, 90]
    if len(arr) > 1: # 7 > 1
        mid = len(arr) // 2 # 7 // 2 = 3
        left_half = arr[:mid] # [64, 34, 25]
        right_half = arr[mid:] # [12, 22, 11, 90]
        merge_sort(left_half) # merge_sort([64, 34, 25])
        merge_sort(right_half) # merge_sort([12, 22, 11, 90])        
        i = j = k = 0 # i = 0, j = 0, k = 0
        while (i < len(left_half) and j < len(right_half)): # 0 < 3 and 0 < 4
            if (left_half[i] < right_half[j]): # 64 > 12, therefore, False
                arr[k] = left_half[i] 
                i += 1
            else:
                arr[k] = right_half[j]
                j += 1
            k += 1
            
        while (i < len(left_half)): # 0 < 3
            arr[k] = left_half[i] # arr == [12, 64, ...]
            i += 1
            k += 1
            
        while (j < len(right_half)): # 0 < 4
            arr[k] = right_half[j] # arr == [12, 22, 64, ...]
            j += 1
            k += 1
        
    return arr

def quick_sort(arr):
    # [63, 90]
    if (len(arr) <= 1): # 2 <= 1, False
        return arr
    pivot = arr[len(arr) // 2] # 90
    left = []
    for i in arr: 
        if i < pivot:
            left.append(i) # left === [63]
    middle = []
    for i in arr:
        if i == pivot:
            middle.append(i) # middle === [90]
    right = []
    for i in arr:
        if i > pivot:
            right.append(i) # right === []
    return quick_sort(left) + middle + quick_sort(right)
    