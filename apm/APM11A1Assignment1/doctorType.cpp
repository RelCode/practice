// doctorType.cpp
#include "doctorType.h"

// Constructors
doctorType::doctorType() : personType(), specialty("") {}

doctorType::doctorType(const std::string& first, const std::string& last,
    const std::string& addr, const std::string& spec)
    : personType(first, last, addr), specialty(spec) {}

void doctorType::setSpecialty(const std::string& spec) {
    specialty = spec;
}

std::string doctorType::getSpecialty() const {
    return specialty;
}

void doctorType::print() const {
    personType::print();
    std::cout << "Specialty: " << specialty << std::endl;
}