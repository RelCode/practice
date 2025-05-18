#include "Passenger.h"

Passenger::Passenger() : passengerID(0), name(""), contactNumber(""), email("") {}

Passenger::Passenger(int id, std::string n, std::string contact, std::string e)
    : passengerID(id), name(n), contactNumber(contact), email(e) {}

Passenger::~Passenger() {} // Destructor

int Passenger::getPassengerID() const {
    return passengerID;
}

std::string Passenger::getName() const {
    return name;
}

std::string Passenger::getContactNumber() const {
    return contactNumber;
}

std::string Passenger::getEmail() const {
    return email;
}

void Passenger::displayDetails() const {
    std::cout << "Passenger ID: " << passengerID
        << "\nName: " << name
        << "\nContact Number: " << contactNumber
        << "\nEmail: " << email << "\n\n";
}

std::ostream& operator<<(std::ostream& os, const Passenger& passenger) { // overloaded output operator
    os << passenger.passengerID << "\n"
        << passenger.name << "\n"
        << passenger.contactNumber << "\n"
        << passenger.email << "\n";
    return os;
}

std::istream& operator>>(std::istream& is, Passenger& passenger) { // overloaded input operator
    is >> passenger.passengerID;
    is.ignore(); // Skip newline
    std::getline(is, passenger.name);
    std::getline(is, passenger.contactNumber);
    std::getline(is, passenger.email);
    return is;
}