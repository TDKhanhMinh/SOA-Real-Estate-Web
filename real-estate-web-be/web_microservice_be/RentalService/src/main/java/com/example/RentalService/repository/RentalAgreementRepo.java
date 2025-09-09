package com.example.RentalService.repository;

import com.example.RentalService.entity.RentalAgreements;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RentalAgreementRepo extends JpaRepository<RentalAgreements, Integer> {
}
