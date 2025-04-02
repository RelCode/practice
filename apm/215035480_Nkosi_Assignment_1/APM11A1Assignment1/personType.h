// personType.h
#ifndef PERSON_TYPE_H
#define PERSON_TYPE_H

#include <string>
#include <iostream>

class personType {
protected:
    std::string firstName;
    std::string lastName;
    std::string address;

public:
    personType();
    personType(const std::string& first, const std::string& last, const std::string& addr);

    void setFirstName(const std::string& first);
    void setLastName(const std::string& last);
    void setAddress(const std::string& addr);

    std::string getFirstName() const;
    std::string getLastName() const;
    std::string getAddress() const;

    void print() const;
};

#endif