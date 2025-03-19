// APM11A1LabExercise1.cpp : This file contains the 'main' function. Program execution begins and ends there.
#include <iostream>
#include "StudentMarks.h"
#include "CurricularMarks.h"
#include "Results.h"

int main()
{
	StudentMarks studentMarks;
	CurricularMarks curricularMarks;
	Results results;

	studentMarks.CaptureStudentInfo();
	curricularMarks.InputCurricularMark();
	results.ShowResults(studentMarks, curricularMarks);
}


