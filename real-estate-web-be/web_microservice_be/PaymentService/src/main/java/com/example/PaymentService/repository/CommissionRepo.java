package com.example.PaymentService.repository;

import com.example.PaymentService.entity.Commissions;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommissionRepo extends JpaRepository<Commissions, Integer> {
}
