import json
from deepdiff import DeepDiff

try:
    with open("llm_response.json", "r") as file:
        data = json.load(file)
except FileNotFoundError:
    print("Document not found")
    exit(1)

response_before = data["before"]
response_after = data["after"]

diff = DeepDiff(response_before, response_after, significant_digits=2)

print("Differences Detected: \n")
print(diff)