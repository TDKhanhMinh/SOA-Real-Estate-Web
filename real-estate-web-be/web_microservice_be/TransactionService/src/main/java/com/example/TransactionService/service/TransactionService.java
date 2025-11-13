package com.example.TransactionService.service;

import com.example.TransactionService.dto.UserCreatedDTO;
import com.example.TransactionService.model.Wallet;
import com.example.TransactionService.request.TopUpRequest;

public interface TransactionService {
    void handleUserCreated(UserCreatedDTO userCreatedDTO);

    Wallet topUpWallet(Long userId, TopUpRequest topUpRequest);
}
