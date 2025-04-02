// main.cpp (billApplicationTest)
#include <iostream>
#include "personType.h"
#include "dateType.h"
#include "doctorType.h"
#include "patientType.h"
#include "billType.h"

int main() {
    // Test doctorType
	std::cout << "\nDoctor's Information" << std::endl;
    doctorType doctor("Mpho", "Mosia", "441 Rabanyane Str, Twala", "Cardiologist");
    doctor.print();

    // Create dates for patient
    dateType birthDate(1980, 5, 10);
    dateType admitDate(2023, 3, 1);
    dateType dischDate(2023, 3, 10);

    // Test patientType
    std::cout << "\nPatient's Information" << std::endl;
    patientType patient("Peter", "Mokaba", "313 Seriti St, Katlehong", "1234567",
        43, birthDate, doctor, admitDate, dischDate);
    patient.print();
	std::cout << ": Doctor's Information" << std::endl;
	doctor.print();

    std::cout << "\nAdmission Date: " << patient.getAdmissionDate().print();
    std::cout << "\nDischarge Date: " << patient.getDischargeDate().print();

    // Test billType
    std::cout << "\n\nBill Charges" << std::endl;
    billType bill(patient.getPatientID(), 350.75, 1200.00, 2500.50);
    bill.print();

	// Test Updating doctor's info
    std::cout << "\nAfter modifying doctor's info" << std::endl;
    std::cout << "Doctor's Information" << std::endl;
    doctorType newDoctor("Lerato", "Mojeka", "144 Morobi Rd, Joaneng", "Psychiatrist");
    doctor.print();

    return 0;
}