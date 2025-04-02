// billType.cpp
#include "billType.h"

// Constructors
billType::billType() : patientID(""), pharmacyCharges(0.0), doctorFee(0.0), roomCharges(0.0) {}

billType::billType(const std::string& id, double pharm, double doc, double room)
    : patientID(id), pharmacyCharges(pharm), doctorFee(doc), roomCharges(room) {}

void billType::setPatientID(const std::string& id) {
    patientID = id;
}

void billType::setPharmacyCharges(double pharm) {
    pharmacyCharges = pharm;
}

void billType::setDoctorFee(double doc) {
    doctorFee = doc;
}

void billType::setRoomCharges(double room) {
    roomCharges = room;
}

std::string billType::getPatientID() const {
    return patientID;
}

double billType::getPharmacyCharges() const {
    return pharmacyCharges;
}

double billType::getDoctorFee() const {
    return doctorFee;
}

double billType::getRoomCharges() const {
    return roomCharges;
}

double billType::calculateTotalCharges() const {
    return pharmacyCharges + doctorFee + roomCharges;
}

void billType::print() const {
    std::cout << "Billing Information for Patient ID: " << patientID << std::endl;
    std::cout << "Pharmacy Charges: R" << pharmacyCharges << std::endl;
    std::cout << "Doctor's Fee: R" << doctorFee << std::endl;
    std::cout << "Room Charges: R" << roomCharges << std::endl;
    std::cout << "Total Charges: R" << calculateTotalCharges() << std::endl;
}