package com.example.SubscriptionService.service;

import com.example.SubscriptionService.dto.UserCreatedDTO;

public interface SubscriptionService {
    void handleUserCreated(UserCreatedDTO userCreatedDTO);
}
