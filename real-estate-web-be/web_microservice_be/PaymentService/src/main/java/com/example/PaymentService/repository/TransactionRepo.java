package com.example.PaymentService.repository;

import com.example.PaymentService.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepo extends JpaRepository<Payment,Integer> {
}
