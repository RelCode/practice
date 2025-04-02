// patientType.cpp
#include "patientType.h"

// Constructors
patientType::patientType() : personType(), patientID(""), age(0) {}

patientType::patientType(const std::string& first, const std::string& last,
    const std::string& addr, const std::string& id,
    int a, const dateType& dob, const doctorType& physician,
    const dateType& admitDate, const dateType& dischDate)
    : personType(first, last, addr), patientID(id), age(a),
    dateOfBirth(dob), attendingPhysician(physician),
    admissionDate(admitDate), dischargeDate(dischDate) {}

// Setters
void patientType::setPatientID(const std::string& id) {
    patientID = id;
}

void patientType::setAge(int a) {
    age = a;
}

void patientType::setDateOfBirth(const dateType& dob) {
    dateOfBirth = dob;
}

void patientType::setAttendingPhysician(const doctorType& physician) {
    attendingPhysician = physician;
}

void patientType::setAdmissionDate(const dateType& admitDate) {
    admissionDate = admitDate;
}

void patientType::setDischargeDate(const dateType& dischDate) {
    dischargeDate = dischDate;
}

// Getters
std::string patientType::getPatientID() const {
    return patientID;
}

int patientType::getAge() const {
    return age;
}

dateType patientType::getDateOfBirth() const {
    return dateOfBirth;
}

doctorType patientType::getAttendingPhysician() const {
    return attendingPhysician;
}

dateType patientType::getAdmissionDate() const {
    return admissionDate;
}

dateType patientType::getDischargeDate() const {
    return dischargeDate;
}

// Print method
void patientType::print() const {
    personType::print();
    std::cout << "\nPatient ID: " << patientID << std::endl;
    std::cout << "Age: " << age << std::endl;
    std::cout << "Date of Birth: ";
    dateOfBirth.print();
    std::cout << "Attending Physician: ";
}