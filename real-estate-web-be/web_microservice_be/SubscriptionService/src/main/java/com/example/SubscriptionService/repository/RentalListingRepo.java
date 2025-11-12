package com.example.SubscriptionService.repository;

import com.example.SubscriptionService.model.RentalListings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RentalListingRepo extends JpaRepository<RentalListings,Integer> {
}
