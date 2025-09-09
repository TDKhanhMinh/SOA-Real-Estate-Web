package com.example.SalesService.repository;

import com.example.SalesService.entity.SalesTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalesRepo extends JpaRepository<SalesTransaction, Integer> {
}
