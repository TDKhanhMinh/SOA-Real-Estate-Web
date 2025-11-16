package com.example.TransactionService.repository;

import com.example.TransactionService.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {

    // Dùng cho User xem lịch sử (phân loại)
    Page<Transaction> findByUserIdAndTransactionType(Long userId, Transaction.TransactionType type, Pageable pageable);

    // Dùng cho Admin xem lịch sử của 1 user (tất cả các loại)
    Page<Transaction> findByUserId(Long userId, Pageable pageable);
}
