// doctorType.h
#ifndef DOCTOR_TYPE_H
#define DOCTOR_TYPE_H

#include "personType.h"

class doctorType : public personType {
private:
    std::string specialty;
    
public:
    doctorType();
    doctorType(const std::string& first, const std::string& last, 
              const std::string& addr, const std::string& spec);
    
    void setSpecialty(const std::string& spec);
    
    std::string getSpecialty() const;
    
    void print() const;
};

#endif