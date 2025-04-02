// dateType.cpp
#include "dateType.h"
#include <iomanip>
#include <sstream>

// Constructors
dateType::dateType() : year(2023), month(1), day(1) {}

dateType::dateType(int y, int m, int d) {
    setDate(y, m, d);
}

void dateType::setDate(int y, int m, int d) {
    year = y;
    month = (m >= 1 && m <= 12) ? m : 1;
    day = (d >= 1 && d <= 31) ? d : 1;
}

void dateType::setYear(int y) {
    year = y;
}

void dateType::setMonth(int m) {
    month = (m >= 1 && m <= 12) ? m : 1;
}

void dateType::setDay(int d) {
    day = (d >= 1 && d <= 31) ? d : 1;
}

int dateType::getYear() const {
    return year;
}

int dateType::getMonth() const {
    return month;
}

int dateType::getDay() const {
    return day;
}

std::string dateType::toString() const {
    std::ostringstream oss;
    oss << std::setfill('0') << std::setw(4) << year << "-"
        << std::setw(2) << month << "-"
        << std::setw(2) << day;
    return oss.str();
}

// this one returns a value to be printed
std::string dateType::print() const {
	return toString();
}