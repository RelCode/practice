#pragma once
#include <string>
#include "Bus.h"
#include "Passenger.h"
#include <iostream>

class Reservation {
private:
    std::string reservationID;
    Bus busID;
    Passenger passengerID;
    int numSeats;
    Date bookingDate;
    double totalFare;

public:
    Reservation();
    Reservation(int id, const Bus& bus, const Passenger& passenger, int& seats, Date& date, double& fare);
    ~Reservation();

    int getReservationID() const;
    Passenger getPassengerID() const;
    Bus getBusID(std::string) const;
    int getNumSeats() const;
    Date getBookingDate() const;
    double getTotalFare() const;

    void displayDetails() const;

    friend std::ostream& operator<<(std::ostream& os, const Reservation& reservation);
    friend std::istream& operator>>(std::istream& is, Reservation& reservation);
};