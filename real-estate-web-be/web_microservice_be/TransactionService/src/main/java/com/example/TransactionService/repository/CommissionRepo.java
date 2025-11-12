package com.example.TransactionService.repository;

import com.example.TransactionService.model.Commissions;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommissionRepo extends JpaRepository<Commissions, Integer> {
}
