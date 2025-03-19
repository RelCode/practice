#include <iostream>
#include <string>
#include <algorithm>


using namespace std;
#pragma once
class Utils
{
	public: bool IsDigitsOnly(const std::string& str) {
		return std::all_of(str.begin(), str.end(), ::isdigit);
	}

	public: void ShowSuccessMessage(string message) {
		std::cout << "\033[32m" << message << "\033[0m" << std::endl;
	}

	public: void ShowErrorMessage(string message) {
		std::cout << "\033[31m" << message << "\033[0m" << std::endl;
	}
};

