import os

class Utils:
    COLOR_INFO = '\033[94m'
    COLOR_WARNING = '\033[93m'
    COLOR_SUCCESS = '\033[92m'
    COLOR_ERROR = '\033[91m'
    COLOR_RESET = '\033[0m'

    def clear_screen(self):
        os.system('cls' if os.name == 'nt' else 'clear')

    def show_info(self, message):
        print(f"{self.COLOR_INFO}{message}{self.COLOR_RESET}")

    def show_warning(self, message):
        print(f"{self.COLOR_WARNING}{message}{self.COLOR_RESET}")

    def show_success(self, message):
        print(f"{self.COLOR_SUCCESS}{message}{self.COLOR_RESET}")

    def show_error(self, message):
        print(f"{self.COLOR_ERROR}{message}{self.COLOR_RESET}")