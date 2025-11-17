package com.example.TransactionService.service;

import com.example.TransactionService.model.Transaction;
import com.example.TransactionService.model.Wallet;
import com.example.TransactionService.request.PurchaseRequest;
import com.example.TransactionService.request.TopUpRequest;
import com.example.TransactionService.response.PurchaseResponse;
import com.example.TransactionService.response.TopUpResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface TransactionService {
    TopUpResponse topUpWallet(Long userId, TopUpRequest topUpRequest);

    // User/Admin xem ví
    Wallet getWalletByUserId(Long userId);

    // User xem lịch sử giao dịch (theo loại)
    Page<Transaction> getTransactionHistoryByType(Long userId, Transaction.TransactionType type, Pageable pageable);

    // Admin xem tất cả lịch sử giao dịch của 1 user
    Page<Transaction> getAllTransactionHistoryByUserId(Long userId, Pageable pageable);

    // Admin xem TẤT CẢ giao dịch nạp tiền (với filter)
    Page<Transaction> getAllTopUpTransactions(
            String search,
            Transaction.Status status,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    );

    PurchaseResponse processPurchase(Long userId, PurchaseRequest purchaseRequest);
}
