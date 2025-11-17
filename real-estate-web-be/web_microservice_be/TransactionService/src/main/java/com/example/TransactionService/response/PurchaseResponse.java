package com.example.TransactionService.response;

import com.example.TransactionService.model.Transaction.Status;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record PurchaseResponse (
        Long transactionId,
        Long userId,
        String email,
        String userName,
        Double amount,
        Status status,
        LocalDateTime createdAt,

        Long subscriptionOrderId
) {
}
