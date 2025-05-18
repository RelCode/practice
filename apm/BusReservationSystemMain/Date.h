#ifndef DATE_H
#define DATE_H

#include <string>
#include <iostream>

class Date {
private:
    int day;
    int month;
    int year;

public:
    Date();
    Date(int d, int m, int y);
    bool isValid() const;
    std::string toString() const;

    friend std::ostream& operator<<(std::ostream& os, const Date& date);
    friend std::istream& operator>>(std::istream& is, Date& date);
};

#endif
