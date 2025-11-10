package com.example.EmailService.repository;

import com.example.EmailService.entity.SalesTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalesRepo extends JpaRepository<SalesTransaction, Integer> {
}
