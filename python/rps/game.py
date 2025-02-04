import os
import random

options = ["rock", "paper", "scissors"]

print("Rock, Paper, Scissors, Go!")

def start_game():
    print("Starting game...")
    while(True):
        level = select_level()
        if(level == "1"):
            play_level_1()
        elif(level == "2"):
            play_level_2()
        else:
            play_level_3()

def select_level():
    while(True):
        level = input("Select level (1, 2, 3 or Enter to Exit): ")
        if(level == ""):
            clear_screen()
            exit()
        if(level == "1" or level == "2" or level == "3"):
            clear_screen()
            return level
        else:
            clear_screen()
            print("Invalid level. Please try again.")

def play_level_1():
    while(True):
        print("Playing level 1...")
        com_choice = random.choice(options)
        player_choice = user_option()
        if(player_choice == ""):
            clear_screen()
            break
        if(player_choice in options):
            print(determine_winner(player_choice, com_choice))
        else:
            clear_screen()
            print("Invalid choice. Please try again.")



def play_level_2():
    while(True):
        print("Playing level 2...")
        com_choice = random.choice(options)
        player_choice = user_option()
        if(player_choice == ""):
            clear_screen()
            break
        if(player_choice in options):
            verdict = determine_winner(player_choice, com_choice)
            # this level let's the computer choose again if the player wins the first time around
            if verdict == "Player Wins!":
                print(determine_winner(player_choice, random.choice(options)))
            else:
                print(verdict)
        else:
            clear_screen()
            print("Invalid choice. Please try again.")
    

def play_level_3():
    while(True):
        print("Playing level 3...")
        com_choice = random.choice(options)
        player_choice = user_option()
        if(player_choice == ""):
            clear_screen()
            break
        if(player_choice in options):
            verdict = determine_winner(player_choice, com_choice)
            # this level let's the computer get 2 turns if the player wins the first two rounds
            if verdict == "Player Wins!":
                verdict = determine_winner(player_choice, random.choice(options))
                if verdict == "Player Wins!":
                    print(determine_winner(player_choice, random.choice(options)))
                else:
                    print(verdict)
            else:
                print(verdict)
        else:
            clear_screen()
            print("Invalid choice. Please try again.")

def clear_screen():
    if(os.name == "nt"):
        os.system("cls")
    else:
        os.system("clear")

def user_option():
    return input("Type in your choice (rock, paper, scissors) or (Press Enter to Return to Select Level) : ").strip().lower()

def determine_winner(player_choice, computer_choice):
    if(player_choice == computer_choice):
        return "It's a tie!"
    else:
        outcomes = {
            "rock": { "scissors": "Player Wins!", "paper": "Computer Wins!" },
            "paper": { "rock": "Player Wins!", "scissors": "Computer Wins!" },
            "scissors": { "paper": "Player Wins!", "rock": "Computer Wins!" }
        }
        return outcomes[player_choice][computer_choice]

start_game()