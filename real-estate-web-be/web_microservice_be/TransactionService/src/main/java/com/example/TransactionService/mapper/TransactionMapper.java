package com.example.TransactionService.mapper;

import com.example.TransactionService.model.Transaction;
import com.example.TransactionService.model.Wallet;
import com.example.TransactionService.response.TopUpResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    // transaction + wallet to TopUpResponse
    default TopUpResponse toTopUpResponse(Transaction transaction, Wallet wallet) {
        if (transaction == null || wallet == null) return null;
        return TopUpResponse.builder()
                .transactionId(transaction.getId())
                .userId(transaction.getUserId())
                .email(transaction.getEmail())
                .userName(transaction.getUserName())
                .transactionType(transaction.getTransactionType())
                .amount(transaction.getAmount())
                .paymentMethod(transaction.getPaymentMethod())
                .status(transaction.getStatus())
                .updatedAt(transaction.getUpdatedAt())
                .walletId(wallet.getId())
                .walletBalance(wallet.getBalance())
                .build();
    }
}
