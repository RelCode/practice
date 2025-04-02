// patientType.h
#ifndef PATIENT_TYPE_H
#define PATIENT_TYPE_H

#include "personType.h"
#include "dateType.h"
#include "doctorType.h"

class patientType : public personType {
private:
    std::string patientID;
    int age;
    dateType dateOfBirth;
    doctorType attendingPhysician;
    dateType admissionDate;
    dateType dischargeDate;

public:
    patientType();
    patientType(const std::string& first, const std::string& last,
        const std::string& addr, const std::string& id,
        int a, const dateType& dob, const doctorType& physician,
        const dateType& admitDate, const dateType& dischDate);

    void setPatientID(const std::string& id);
    void setAge(int a);
    void setDateOfBirth(const dateType& dob);
    void setAttendingPhysician(const doctorType& physician);
    void setAdmissionDate(const dateType& admitDate);
    void setDischargeDate(const dateType& dischDate);

    std::string getPatientID() const;
    int getAge() const;
    dateType getDateOfBirth() const;
    doctorType getAttendingPhysician() const;
    dateType getAdmissionDate() const;
    dateType getDischargeDate() const;

    void print() const;
};

#endif