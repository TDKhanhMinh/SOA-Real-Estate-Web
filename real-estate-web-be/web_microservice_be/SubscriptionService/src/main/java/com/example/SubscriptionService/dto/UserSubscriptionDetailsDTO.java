package com.example.SubscriptionService.dto;

import com.example.SubscriptionService.model.UserSubscription.Status;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record UserSubscriptionDetailsDTO (
        // Thông tin từ UserSubscription
       Long userId,
       String email,
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
