package com.example.ListingService.repository;

import com.example.ListingService.entity.Properties;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertiesRepo extends JpaRepository<Properties, Integer> {
}
