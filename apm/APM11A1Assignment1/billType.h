// billType.h
#ifndef BILL_TYPE_H
#define BILL_TYPE_H

#include <string>
#include <iostream>

class billType {
private:
    std::string patientID;
    double pharmacyCharges;
    double doctorFee;
    double roomCharges;

public:
    billType();
    billType(const std::string& id, double pharm, double doc, double room);

    void setPatientID(const std::string& id);
    void setPharmacyCharges(double pharm);
    void setDoctorFee(double doc);
    void setRoomCharges(double room);

    std::string getPatientID() const;
    double getPharmacyCharges() const;
    double getDoctorFee() const;
    double getRoomCharges() const;

    double calculateTotalCharges() const;

    void print() const;
};

#endif