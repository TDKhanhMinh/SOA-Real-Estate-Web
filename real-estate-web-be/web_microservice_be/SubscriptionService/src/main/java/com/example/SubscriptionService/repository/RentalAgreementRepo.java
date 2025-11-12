package com.example.SubscriptionService.repository;

import com.example.SubscriptionService.model.RentalAgreements;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RentalAgreementRepo extends JpaRepository<RentalAgreements, Integer> {
}
