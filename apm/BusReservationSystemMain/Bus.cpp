#include "Bus.h"
#include <iostream>
#include <iomanip>

Bus::Bus() {}

Bus::Bus(int id, std::string number, std::string src, std::string dest, int seats, double cost, Date date, std::string time)
    : busID(id), busNumber(number), source(src), destination(dest), totalSeats(seats),
    fare(cost), departureDate(date), departureTime(time) {}

Bus::~Bus() {}

int Bus::getBusID() const { 
    return busID;
}
std::string Bus::getBusNumber() const { return busNumber; }
std::string Bus::getSource() const { return source; }
std::string Bus::getDestination() const { return destination; }
int Bus::getTotalSeats() const { return totalSeats; }
double Bus::getFare() const { return fare; }
Date Bus::getDepartureDate() const { return departureDate; }
std::string Bus::getDepartureTime() const { return departureTime; }

void Bus::displayDetails() const {
    std::cout << "Bus ID: " << busID
        << "\nBus Number: " << busNumber
        << "\nSource: " << source
        << "\nDestination: " << destination
        << "\nSeats: " << totalSeats
		<< "\nFare: R" << std::fixed << std::setprecision(2) << fare
        << "\nDeparture Date: " << departureDate
        << "\nDeparture Time: " << departureTime << "\n\n";
}

std::ostream& operator<<(std::ostream& os, const Bus& bus) {
    os << bus.busID << "\n" << bus.busNumber << "\n" << bus.source << "\n" << bus.destination << "\n"
        << bus.totalSeats << "\n" << bus.fare << "\n" << bus.departureDate << "\n" << bus.departureTime << "\n";
    return os;
}

std::istream& operator>>(std::istream& is, Bus& bus) {
    is >> bus.busID;
    is.ignore(); // to skip newline
    std::getline(is, bus.busNumber);
    std::getline(is, bus.source);
    std::getline(is, bus.destination);
    is >> bus.totalSeats >> bus.fare >> bus.departureDate;
    is.ignore(); // to skip newline
    std::getline(is, bus.departureTime);
    return is;
}
