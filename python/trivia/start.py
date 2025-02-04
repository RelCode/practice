import json
import os

#open json file in read-mode
with open("./content.json", "r") as file:
    content = json.load(file)

topics = content['topics'].keys()

def start_game():
    while(True):
        print("Welcome to Trivia!")

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
                    obtained_point = obtained_point + 1
                    show_success("Correct Answer!")
                else:
                    show_warning("Wrong Answer!")
                available_points = available_points + 1
                break
            else:
                show_error("Invalid Choice. Please Try Again.")
                continue
    clear_screen()
    show_success(f"Game Over! You Scored {obtained_point} out of {available_points} points.")
    print("=================================================================================")


def clear_screen():
    if (os.name == "nt"):
        os.system("cls")

def show_info(message):
    print("\033[94m", end="")
    print(message)
    print("\033[0m", end="")

def show_success(message):
    print("\033[92m", end="")
    print(message)
    print("\033[0m", end="")

def show_warning(message):
    print("\033[93m", end="")
    print(message)
    print("\033[0m", end="")

def show_error(message):
    print("\033[91m", end="")
    print(message)
    print("\033[0m", end="")

clear_screen() # clear screen before game starts
start_game()