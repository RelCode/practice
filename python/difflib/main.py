import csv
import difflib
from pathlib import Path
from typing import List, Dict

def load_data(file: str) -> Dict[list[str], List[str]]:
    queries = []
    responses = []
    with open(file, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            queries.append(row['Query'])
            responses.append(row['Response'])
    return [queries, responses]

def compare_responses(responses: List[str]) -> None:
    for i in range(len(responses)):
        for j in range(i + 1, len(responses)):
            print(f"\nComparing Response {i+1} vs Response {j+1}")
            print("-" * 50)
            
            # Create differ object
            d = difflib.Differ()
            diff = list(d.compare(responses[i].splitlines(), 
                                responses[j].splitlines()))
            
            line_num1 = line_num2 = 0
            
            # Print differences
            for line in diff:
                if line.startswith('  '): # unchanged
                    print(line)
                    line_num1 += 1
                    line_num2 += 1
                elif line.startswith('- '): # removed
                    word_count = len(line[2:].split())
                    print(f'\033[91m- [L{line_num1+1}]({word_count} words) {line[2:]}\033[0m')  # red
                    line_num1 += 1
                elif line.startswith('+ '): # added
                    word_count = len(line[2:].split())
                    print(f'\033[92m+ [L{line_num2+1}]({word_count} words) {line[2:]}\033[0m')  # green
                    line_num2 += 1
            
            # Calculate similarity
            similarity = difflib.SequenceMatcher(None, 
                                               responses[i], 
                                               responses[j]).ratio()
            print(f"\nSimilarity ratio: {similarity:.2%}")

def testing_csv():
    filePath = "data/fictional.csv"
    [queries, responses] = load_data(filePath)
    
    for i in range(len(queries)):
        print("=" * 50)
        compare_responses(responses)
        
def testing_txt():
    txt1 = Path("data/doc1.txt").read_text(encoding='utf-8-sig')
    txt2 = Path("data/doc2.txt").read_text(encoding='utf-8-sig')
    compare_responses([txt1, txt2])

if __name__ == "__main__":
    # testing_csv()
    testing_txt()