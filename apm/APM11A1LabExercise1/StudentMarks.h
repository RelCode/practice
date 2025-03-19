#include <iostream>
#include <string>
#include <cctype>
#include <algorithm>
#include <vector>
#include"Utils.h"

using namespace std;

#pragma once
class StudentMarks : public Utils
{
	public: int StudentNo;
	public: std::string StudentName;
	public: std::string Subject;
	public: std::vector<int> Grades;

	public: void CaptureStudentInfo() {
		std::cout << "******************** Capture Student Subject Mark ********************" << std::endl;
		StudentNo = InputStudentNo();
		StudentName = InputStudentName();
		Subject = InputSubject();
		Grades = InputGrades();
	}

	private: int InputStudentNo() {
		bool valid = false;
		std::string studentNo;
		while (!valid) {
			std::cout << "Enter student number (at least 7 digits): ";
			std::cin >> studentNo;
			if (IsDigitsOnly(studentNo) && studentNo.length() > 6) { // Student number must be at least 7 digits long so that it can look a little bit realistic
				return std::stoi(studentNo);
			}
			else {
				Utils::ShowErrorMessage("Invalid student number. Please try again.");
			}
		}
	}

	private: std::string InputStudentName() {
		std::string name;
		bool valid = false;
		while (!valid) {
			std::cout << "Enter Student Name: ";
			std::cin >> name;
			if (name.length() > 1) {
				return name;
			}
			else {
				Utils::ShowErrorMessage("Invalid student name. Please try again.");
			}
		}
		return name;
	}

	private: std::string InputSubject() {
		std::string subject;
		bool valid = false;
		while (!valid) {
			std::cout << "Enter subject: ";
			std::cin >> subject;
			if (subject.length() > 2) {
				return subject;
			}
			else {
				Utils::ShowErrorMessage("Invalid subject. Please try again.");
			}
		}
		return subject;
	}

	private: std::vector<int> InputGrades() {
		std::vector<int> grades;
		while (grades.size() < 3) {
			std::string grade;
			std::cout << "Enter Grade (" << (grades.size() + 1) << " of 3 highest mark): ";
			std::cin >> grade;
			if (IsDigitsOnly(grade) && (std::stoi(grade) >= 0 && std::stoi(grade) <= 100)) {
				grades.push_back(std::stoi(grade));
			}else {
				Utils::ShowErrorMessage("Invalid grade. Please try again.");
			}
		}
		return grades;
	}
};

