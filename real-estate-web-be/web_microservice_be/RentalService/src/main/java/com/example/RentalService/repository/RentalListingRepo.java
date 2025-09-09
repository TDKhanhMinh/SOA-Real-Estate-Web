package com.example.RentalService.repository;

import com.example.RentalService.entity.RentalListings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RentalListingRepo extends JpaRepository<RentalListings,Integer> {
}
