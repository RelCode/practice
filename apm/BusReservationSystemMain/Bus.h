#ifndef BUS_H
#define BUS_H

#include <string>
#include "Date.h"

class Bus {
private:
    int busID;
    std::string busNumber;
    std::string source;
    std::string destination;
    int totalSeats;
    double fare;
    Date departureDate;
    std::string departureTime;

public:
    Bus();
    Bus(int id, std::string number, std::string src, std::string dest, int seats, double cost, Date date, std::string time);
    ~Bus();

    int getBusID() const;
    std::string getBusNumber() const;
    std::string getSource() const;
    std::string getDestination() const;
    int getTotalSeats() const;
    double getFare() const;
    Date getDepartureDate() const;
    std::string getDepartureTime() const;

    void displayDetails() const;

    friend std::ostream& operator<<(std::ostream& os, const Bus& bus);
    friend std::istream& operator>>(std::istream& is, Bus& bus);
};

#endif
