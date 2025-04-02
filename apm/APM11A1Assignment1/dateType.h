// dateType.h
#ifndef DATE_TYPE_H
#define DATE_TYPE_H

#include <string>
#include <iostream>

class dateType {
private:
    int year;
    int month;
    int day;

public:
    dateType();
    dateType(int y, int m, int d);

    void setDate(int y, int m, int d);
    void setYear(int y);
    void setMonth(int m);
    void setDay(int d);

    int getYear() const;
    int getMonth() const;
    int getDay() const;
    std::string toString() const;

    std::string print() const;
};

#endif