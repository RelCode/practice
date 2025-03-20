#include <iostream>
#include <vector>
#include "StudentMarks.h"
#include "CurricularMarks.h"
#include "Utils.h"

using namespace std;

#pragma once
class Results : public StudentMarks, public CurricularMarks, public Utils
{
	public: void ShowResults() {
		CaptureStudentInfo();
		InputCurricularMark();
		int totalMarks = 0;
		for (int i = 0; i < Grades.size(); i++) {
			totalMarks += Grades[i];
		}
		totalMarks += CurricularMark;
		double averageMarks = totalMarks / static_cast<double>(4);
		Utils::ShowSuccessMessage("******************** Student Overall Subject Performance ********************");
		std::cout << "Student Number: " << StudentNo << std::endl;
		std::cout << "Student Name: " << StudentName << std::endl;
		std::cout << "Subject Name: " << Subject << std::endl;
		std::cout << "Total Marks: " << totalMarks << std::endl;
		std::cout << "Average Marks: " << averageMarks << std::endl;
		std::cout << std::endl;
	}
};

