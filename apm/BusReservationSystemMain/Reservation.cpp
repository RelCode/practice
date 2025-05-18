#include "Reservation.h"

Reservation::Reservation() : reservationID(""), numSeats(0), totalFare(0.0) {}

Reservation::Reservation(int id, const Bus& bus, const Passenger& passenger, int& seats, Date& date, double& fare)
    : reservationID(std::to_string(id)), busID(bus), passengerID(passenger),
    numSeats(seats), bookingDate(date), totalFare(fare) {}

Reservation::~Reservation() {}

int Reservation::getReservationID() const {
    return std::stoi(reservationID);
}

Passenger Reservation::getPassengerID() const {
    return passengerID;
}

Bus Reservation::getBusID(std::string busNumber) const {
    return busID;
}

int Reservation::getNumSeats() const {
    return numSeats;
}

Date Reservation::getBookingDate() const {
    return bookingDate;
}

double Reservation::getTotalFare() const {
    return totalFare;
}

void Reservation::displayDetails() const {
    std::cout << "Reservation ID: " << reservationID << "\n";
    std::cout << "Bus Information:\n";
    busID.displayDetails();
    std::cout << "Passenger Information:\n";
    passengerID.displayDetails();
    std::cout << "Number of Seats: " << numSeats << "\n";
    std::cout << "Booking Date: " << bookingDate << "\n";
    std::cout << "Total Fare: R" << totalFare << "\n\n";
}

std::ostream& operator<<(std::ostream& os, const Reservation& reservation) {
    os << reservation.reservationID << "\n";
    os << reservation.busID;
    os << reservation.passengerID;
    os << reservation.numSeats << "\n";
    os << reservation.bookingDate << "\n";
    os << reservation.totalFare << "\n";
    return os;
}

// Overloaded input operator
std::istream& operator>>(std::istream& is, Reservation& reservation) {
    std::getline(is, reservation.reservationID);
    is >> reservation.busID;
    is >> reservation.passengerID;
    is >> reservation.numSeats;
    is >> reservation.bookingDate;
    is >> reservation.totalFare;
    is.ignore(); // Skip newline
    return is;
}