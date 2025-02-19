import json
from deepdiff import DeepDiff
from rich import print
from rich.panel import Panel
from rich.console import Console

# initialize rich console
console = Console()


try:
    with open("llm_response.json", "r") as file:
        data = json.load(file)
except FileNotFoundError:
    print("Document not found")
    exit(1)

response_before = data["before"]
response_after = data["after"]

console.print(Panel.fit("[bold yellow] Differences Detected: [/bold yellow]"))
diff = DeepDiff(response_before, response_after, significant_digits=2)

if not diff:
    console.print(Panel.fit("[bold green] No Differences Detected: [/bold green]"))
else:
    for key, value in diff.items():
        console.print(f"[bold cyan]{key}[/bold cyan]: ",style="bold cyan")
        console.print(value, style="white")

print("Differences Detected: \n")
print(diff)