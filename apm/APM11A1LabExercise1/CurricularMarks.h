#include <iostream>
#include <string>
#include "Utils.h"
#pragma once
class CurricularMarks : public Utils
{
	public: int CurricularMark = 0;

	public: void InputCurricularMark() {
		bool valid = false;
		while (!valid) {
			std::string mark;
			std::cout << "Enter the Mark for Curricular Activities: ";
			std::cin >> mark;
			if (IsDigitsOnly(mark) && (std::stoi(mark) >= 0 && std::stoi(mark) <= 100)) {
				CurricularMark = std::stoi(mark);
				valid = true;
			}
			else {
				Utils::ShowErrorMessage("Invalid mark. Please try again.");
			}
		}
	}
};

