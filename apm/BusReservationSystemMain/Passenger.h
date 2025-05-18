#pragma once
#include <string>
#include <iostream>
#include <fstream>

class Passenger {
private:
    int passengerID;
    std::string name;
    std::string contactNumber;
    std::string email;

public:
	Passenger(); // constructora
    Passenger(int id, std::string n, std::string contact, std::string e);
    ~Passenger();

    int getPassengerID() const;
    std::string getName() const;
    std::string getContactNumber() const;
    std::string getEmail() const;

	void displayDetails() const; // display method

	friend std::ostream& operator<<(std::ostream& os, const Passenger& passenger); // friend stream operator for I/O
    friend std::istream& operator>>(std::istream& is, Passenger& passenger);
};