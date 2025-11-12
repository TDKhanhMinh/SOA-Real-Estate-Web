package com.example.SubscriptionService.dto;

import com.example.SubscriptionService.model.UserSubscription.Status;

import java.time.LocalDateTime;

public record UserSubscriptionDetailsDTO (
        // Thông tin từ UserSubscription
       Long userId,
       LocalDateTime startDate,
       LocalDateTime endDate,
       Status status,

       // Thông tin chi tiết từ Subscription
       Long subscriptionId,
       String subscriptionName,
       Double price,
       Integer duration,
       String description,
       Integer maxPost,
       Integer priority,
       Integer postExpiryDays) {
}
