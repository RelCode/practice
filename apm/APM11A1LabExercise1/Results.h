#include <iostream>
#include <vector>
#include "StudentMarks.h"
#include "CurricularMarks.h"
#include "Utils.h"

using namespace std;

#pragma once
class Results : public StudentMarks, public CurricularMarks, public Utils
{
	public: void ShowResults(StudentMarks& studentMarks, CurricularMarks& curricularMark) {
		int totalMarks = 0;
		for (int i = 0; i < studentMarks.Grades.size(); i++) {
			totalMarks += studentMarks.Grades[i];
		}
		totalMarks += curricularMark.CurricularMark;
		double averageMarks = totalMarks / static_cast<double>(4);
		Utils::ShowSuccessMessage("******************** Student Overall Subject Performance ********************");
		std::cout << "Student Number: " << studentMarks.StudentNo << std::endl;
		std::cout << "Student Name: " << studentMarks.StudentName << std::endl;
		std::cout << "Subject Name: " << studentMarks.Subject << std::endl;
		std::cout << "Total Marks: " << totalMarks << std::endl;
		std::cout << "Average Marks: " << averageMarks << std::endl;
		std::cout << std::endl;
	}
};

