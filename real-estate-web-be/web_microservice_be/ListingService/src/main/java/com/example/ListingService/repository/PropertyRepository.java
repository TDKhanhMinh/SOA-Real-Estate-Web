package com.example.ListingService.repository;

import com.example.ListingService.model.Properties;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyRepository extends JpaRepository<Properties, Integer> {
}
