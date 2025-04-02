// personType.cpp
#include "personType.h"

// Constructors
personType::personType() : firstName(""), lastName(""), address("") {}

personType::personType(const std::string& first, const std::string& last, const std::string& addr)
    : firstName(first), lastName(last), address(addr) {}

void personType::setFirstName(const std::string& first) {
    firstName = first;
}

void personType::setLastName(const std::string& last) {
    lastName = last;
}

void personType::setAddress(const std::string& addr) {
    address = addr;
}

std::string personType::getFirstName() const {
    return firstName;
}

std::string personType::getLastName() const {
    return lastName;
}

std::string personType::getAddress() const {
    return address;
}

void personType::print() const {
    std::cout << "Name: " << firstName << " " << lastName << std::endl;
    std::cout << "Address: " << address << std::endl;
}