#include "Date.h"
#include <sstream>
#include <iomanip>

Date::Date() : day(1), month(1), year(2000) {}

Date::Date(int d, int m, int y) : day(d), month(m), year(y) {}

bool Date::isValid() const {
    return (day > 0 && day <= 31 && month > 0 && month <= 12 && year >= 2023);
}

std::string Date::toString() const {
    std::ostringstream oss;
    oss << std::setw(2) << std::setfill('0') << day << " "
        << std::setw(2) << std::setfill('0') << month << " "
        << year; // enforces format
    return oss.str();
}

std::ostream& operator<<(std::ostream& os, const Date& date) {
    os << date.toString();
    return os;
}

std::istream& operator>>(std::istream& is, Date& date) {
    is >> date.day >> date.month >> date.year;
    return is;
}
