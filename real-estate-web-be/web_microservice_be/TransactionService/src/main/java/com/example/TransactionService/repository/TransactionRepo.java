package com.example.TransactionService.repository;

import com.example.TransactionService.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepo extends JpaRepository<Payment,Integer> {
}
