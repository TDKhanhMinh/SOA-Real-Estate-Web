package com.example.TransactionService.response;

import com.example.TransactionService.model.Transaction.TransactionType;
import com.example.TransactionService.model.Transaction.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TopUpResponse {
    // Fields from Transaction
    private Long transactionId;
    private Long userId;
    private String email;
    private String userName;
    private Double amount;
    private String paymentMethod;
    private Status status;
    private LocalDateTime updatedAt;
    private TransactionType transactionType;

    // Fields from Wallet
    private Long walletId;
    private Double walletBalance;
}
