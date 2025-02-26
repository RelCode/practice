import csv
import difflib
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
            
            # Print differences
            for line in diff:
                if line.startswith('  '): # unchanged
                    print(line)
                elif line.startswith('- '): # removed
                    print(f'\033[91m{line}\033[0m')  # red
                elif line.startswith('+ '): # added
                    print(f'\033[92m{line}\033[0m')  # green
            
            # Calculate similarity
            similarity = difflib.SequenceMatcher(None, 
                                               responses[i], 
                                               responses[j]).ratio()
            print(f"\nSimilarity ratio: {similarity:.2%}")

def main():
    filePath = "data/fictional.csv"
    [queries, responses] = load_data(filePath)
    
    for i in range(len(queries)):
        print("=" * 50)
        compare_responses(responses)

if __name__ == "__main__":
    main()