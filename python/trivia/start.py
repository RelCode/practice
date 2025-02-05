import json
import os

try:
    #open json file in read-mode
    with open("./content.json", "r") as file:
        content = json.load(file)
except FileNotFoundError:
    print("Error: Content File Not Found!")
    exit(1)

topics = content['topics'].keys()

COLOR_INFO = "\033[94m"
COLOR_SUCCESS = "\033[92m"
COLOR_WARNING = "\033[93m"
COLOR_ERROR = "\033[91m"
COLOR_RESET = "\033[0m"

def start_game():
    while(True):
        show_info("Welcome to Trivia!")

        for index, topic in enumerate(topics):
            print(f"{index + 1}: {topic.capitalize()}")

        choice = input("Choose a Topic [or Enter to Exit]: ")

        if (choice == ""):
            clear_screen()
            print("Goodbye!")
            break
        elif (choice.isdigit() and int(choice) > 0 and int(choice) <= len(topics)):
            clear_screen()
            start_trivia(list(topics)[int(choice) - 1])
        else:
            clear_screen()
            show_error("Invalid Choice. Please Try Again.")
            continue

def start_trivia(topic):
    topic_content = content['topics'][topic]
    topic_content_ids = list(topic_content.keys())
    available_points = 0
    obtained_point = 0
    for id in topic_content_ids:
        show_info(topic_content[id]["question"])
        while(True):
            for index, option in enumerate(topic_content[id]["options"]):
                print(f"{index + 1}: {option}")
            choice = input("Your Choice [or Enter to Skip]: ")
            clear_screen()
            if(choice == ""):
                show_warning("Question Skipped!")
                available_points += 1
                break
            elif (choice.isdigit() and int(choice) > 0 and int(choice) < len(topic_content[id]["options"])):
                if (topic_content[id]["answer"] == (int(choice) - 1)):
                    obtained_point += 1
                    show_success("Correct Answer!")
                else:
                    show_warning("Wrong Answer!")
                available_points += 1
                break
            else:
                show_error("Invalid Choice. Please Try Again.")
                continue
    clear_screen()
    show_success(f"Game Over! You Scored {obtained_point} out of {available_points} points.")
    print("================================================================================")


def clear_screen():
    if (os.name == "nt"):
        os.system("cls")

def show_info(message):
    print(f"{COLOR_INFO}{message}{COLOR_RESET}")

def show_success(message):
    print(f"{COLOR_SUCCESS}{message}{COLOR_RESET}")

def show_warning(message):
    print(f"{COLOR_WARNING}{message}{COLOR_RESET}")

def show_error(message):
    print(f"{COLOR_ERROR}{message}{COLOR_RESET}")

clear_screen() # clear screen before game starts
start_game()