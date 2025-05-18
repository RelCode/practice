// BusReservationSystemMain.cpp : This file contains the 'main' function. Program execution begins and ends there.
//
#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <limits>
#include "Bus.h"
#include "Passenger.h"
#include "Reservation.h"

using namespace std;

void displayMenu();
void displayPassengers(const string& filename);
void displayBuses(const string& filename);
void displayReservations(const string& filename);
void addNewPassenger(const string& filename);
void addNewBus(const string& filename);
void addReservation(const string& busFile, const string& passengerFile, const string& reservationFile);
int getLastId(const string& filename, char type);
Bus findBus(const string& filename, int busId);
Passenger findPassenger(const string& filename, int passengerId);
int getNextId(const string& filename, string type);

int main() {
    string busFile = "x64\\Debug\\buses_info.txt"; // I really struggled with the file path, so I hardcoded it
    string passengerFile = "x64\\Debug\\passengers_info.txt"; // to the Debug folder
    string reservationFile = "x64\\Debug\\reservations.txt"; // if there's a better way to do this, can Prof please make a recommendation

    int choice;
    bool exit = false;

    while (!exit) { // application should run utnil user chooses to exit
        displayMenu();
        cout << "Enter your choice: ";

        if (!(cin >> choice)) { // check if user provided valid menu choice
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n'); // Clear input buffer
            cout << "Invalid input. Please enter a number.\n";
            continue;
        }

        // Process user choice
        switch (choice) {
        case 1:
            displayPassengers(passengerFile);
            break;
        case 2:
            displayBuses(busFile);
            break;
        case 3:
            displayReservations(reservationFile);
            break;
        case 4:
            addNewPassenger(passengerFile);
            break;
        case 5:
            addNewBus(busFile);
            break;
        case 6:
            addReservation(busFile, passengerFile, reservationFile);
            break;
        case 7:
            cout << "Please come again! #SihambaSonke!!!\n";
            exit = true;
            break;
        default:
            cout << "Invalid choice. Please try again.\n";
        }

        if (!exit) {
            cout << "\nPress Enter to continue..."; // Block to ensure that user get to see output before clearing the screen
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cin.get();
            system("cls"); // Clear screen (Windows-specific)
        }
    }

    return 0;
}

// Display menu options
void displayMenu() {
    cout << "====================================================\n";
    cout << "              BUS RESERVATION SYSTEM               \n";
    cout << "====================================================\n";
    cout << "1. Display Passengers' Information\n";
    cout << "2. Display Buses' Information\n";
    cout << "3. Display Reservations\n";
    cout << "4. Add new Passenger Data\n";
    cout << "5. Add new Bus Data\n";
    cout << "6. Add new Reservation\n";
    cout << "7. Exit\n";
    cout << "====================================================\n";
}

// Display all passengers from the file
void displayPassengers(const string& filename) {
    ifstream file(filename);
    if (!file.is_open()) {
        cout << "Error: Could not open " << filename << endl;
        return;
    }

    vector<Passenger> passengers;
    Passenger p;

    cout << "\n========== PASSENGER INFORMATION ==========\n";

    if (file.peek() == ifstream::traits_type::eof()) { // check if file is empty
        cout << "No passengers found in the system.\n";
        file.close();
        return;
    }

    while (file >> p) {
        passengers.push_back(p); // read from file and add to vector
    }
    file.close();

    for (const auto& passenger : passengers) {
        passenger.displayDetails(); // display actuall details
    }

    cout << "Total passengers: " << passengers.size() << endl;
}

// TODO:: Copy and Paste Passenger method to Bus method


void displayBuses(const string& filename) {
    ifstream file(filename);
    if (!file.is_open()) {
        cout << "Error: Could not open " << filename << endl;
        return;
    }

    vector<Bus> buses;
    Bus b;

    cout << "\n========== BUS INFORMATION ==========\n";

    if (file.peek() == ifstream::traits_type::eof()) {
        cout << "No buses found in the system.\n";
        file.close();
        return;
    }

    while (file >> b) {
        buses.push_back(b);
    }
    file.close();

    for (const auto& bus : buses) {
        bus.displayDetails();
    }

    cout << "Total buses: " << buses.size() << endl;
}

void displayReservations(const string& filename) {
    ifstream file(filename);
    if (!file.is_open()) {
        cout << "Error: Could not open " << filename << endl;
        return;
    }

    vector<Reservation> reservations;
    Reservation r;

    cout << "\n========== RESERVATION INFORMATION ==========\n";

    if (file.peek() == ifstream::traits_type::eof()) {
        cout << "No reservations found in the system.\n";
        file.close();
        return;
    }

    while (file >> r) {
        reservations.push_back(r);
    }
    file.close();

    for (const auto& reservation : reservations) {
        reservation.displayDetails();
    }

    cout << "Total reservations: " << reservations.size() << endl;
}

int getNextId(const string& filename, string type) { // we want to get next ID based on the contents of the file
    ifstream file(filename);

    if (!file.is_open()) { // if file is not open, we assume is empty and return 1
        return 1;
    }

    int maxId = 0;

    if (type == "passenger") {
        Passenger p;
        while (file >> p) {
            if (p.getPassengerID() > maxId) {
                maxId = p.getPassengerID();
            }
        }
    }
    else if (type == "bus") {
        Bus b;
        while (file >> b) {
            maxId++; // Assuming bus ID is sequential, increment maxId for each bus
        }
    }
    else if (type == "reservation") {
        Reservation r;
        while (file >> r) {
            if (r.getReservationID() > maxId) {
                maxId = r.getReservationID();
            }
        }
    }

    file.close();
    return maxId + 1;
}

void addNewPassenger(const string& filename) {
    int id = getNextId(filename, "passenger");

    string name, contactNumber, email;

    cout << "\n========== ADD NEW PASSENGER ==========\n";
    cout << "Enter passenger name: ";
    cin.ignore();
    getline(cin, name);

    cout << "Enter contact number: ";
    getline(cin, contactNumber);

    cout << "Enter email: ";
    getline(cin, email);

    Passenger newPassenger(id, name, contactNumber, email);

    ofstream file(filename, ios::app);
    if (!file.is_open()) {
        cout << "Error: Could not open " << filename << " for writing.\n";
        return;
    }

    file << newPassenger;
    file.close();

    cout << "\nPassenger added successfully with ID: " << id << endl;
}

void addNewBus(const string& filename) {
    int id = getNextId(filename, "bus");

    string busNumber, source, destination, departureTime;
    int totalSeats;
    double fare;
    int day, month, year;

    cout << "\n========== ADD NEW BUS ==========\n";

    cout << "Enter bus number: ";
    cin.ignore();
    getline(cin, busNumber);

    cout << "Enter source: ";
    getline(cin, source);

    cout << "Enter destination: ";
    getline(cin, destination);

    cout << "Enter total seats: ";
    cin >> totalSeats;

    cout << "Enter fare (R): ";
    cin >> fare;

    cout << "Enter departure date (day month year): ";
    cin >> day >> month >> year;

    Date departureDate(day, month, year);

    cout << "Enter departure time (HH:MM): ";
    cin.ignore();
    getline(cin, departureTime);

    Bus newBus(id, busNumber, source, destination, totalSeats, fare, departureDate, departureTime);

    ofstream file(filename, ios::app);
    if (!file.is_open()) {
        cout << "Error: Could not open " << filename << " for writing.\n";
        return;
    }

    file << endl << newBus;
    file.close();

    cout << "\nBus added successfully with ID: " << id << endl;
}

Bus findBus(const string& filename, int busId) { // we want to find a bus based on the ID
    ifstream file(filename);
    if (!file.is_open()) {
        cout << "Error: Could not open " << filename << endl;
        return Bus(); // Return empty bus
    }

    Bus b;
    while (file >> b) {
        if (b.getBusID() == busId){
            file.close();
            return b;
        }
    }

    file.close();
    return Bus(); // Return empty bus if not found
}

Passenger findPassenger(const string& filename, int passengerId) {
    ifstream file(filename);
    if (!file.is_open()) {
        cout << "Error: Could not open " << filename << endl;
        return Passenger(); // Return empty passenger
    }

    Passenger p;
    while (file >> p) {
        if (p.getPassengerID() == passengerId) {
            file.close();
            return p;
        }
    }

    file.close();
    return Passenger(); // Return empty passenger if not found
}

void addReservation(const string& busFile, const string& passengerFile, const string& reservationFile) { // add new reservation
    int busId, passengerId, numSeats;
    int day, month, year;

    cout << "\n========== ADD NEW RESERVATION ==========\n";

    displayBuses(busFile); // display available buses
    cout << "Enter Bus ID: ";
    cin >> busId;

    Bus selectedBus = findBus(busFile, busId); // use busID to find selected bus
    if (selectedBus.getBusNumber().empty()) {
        cout << "Error: Bus not found.\n";
        return;
    }

    displayPassengers(passengerFile);
    cout << "Enter Passenger ID: ";
    cin >> passengerId;

    Passenger selectedPassenger = findPassenger(passengerFile, passengerId);
    if (selectedPassenger.getName().empty()) {
        cout << "Error: Passenger not found.\n";
        return;
    }

    cout << "Enter number of seats to reserve: ";
    cin >> numSeats;

    if (numSeats <= 0) { // need to validate user input
        cout << "Error: Number of seats must be greater than 0.\n";
        return;
    }

    cout << "Enter booking date (day month year): ";
    cin >> day >> month >> year;

    Date bookingDate(day, month, year);

    double totalFare = selectedBus.getFare() * numSeats; // calculate fare amount

    int id = getNextId(reservationFile, "reservation"); // get next ID for reservation using the method above

    // NOTE!!!!
	// The Reservation constructor should be modified to accept the Bus and Passenger objects directly
	// The issue this causes is that the provided reservations.txt file only contains the busID and passengerID
    Reservation newReservation(id, selectedBus, selectedPassenger, numSeats, bookingDate, totalFare);

    ofstream file(reservationFile, ios::app);
    if (!file.is_open()) {
        cout << "Error: Could not open " << reservationFile << " for writing.\n";
        return;
    }

	cout << "Selected Bus ID[THWAAAA]: " << selectedBus.getBusID() << endl;

	file << newReservation << endl;
    file.close();

    cout << "\nReservation added successfully with ID: " << id << endl;
    cout << "Total fare: R" << totalFare << endl;
}

// Run program: Ctrl + F5 or Debug > Start Without Debugging menu
// Debug program: F5 or Debug > Start Debugging menu

// Tips for Getting Started: 
//   1. Use the Solution Explorer window to add/manage files
//   2. Use the Team Explorer window to connect to source control
//   3. Use the Output window to see build output and other messages
//   4. Use the Error List window to view errors
//   5. Go to Project > Add New Item to create new code files, or Project > Add Existing Item to add existing code files to the project
//   6. In the future, to open this project again, go to File > Open > Project and select the .sln file
