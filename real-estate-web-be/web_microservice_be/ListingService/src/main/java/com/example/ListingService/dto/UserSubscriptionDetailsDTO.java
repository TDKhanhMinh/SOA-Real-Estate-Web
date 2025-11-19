
package com.example.ListingService.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserSubscriptionDetailsDTO {
    // Thông tin từ UserSubscription
    Long userId;
    String email;
    LocalDateTime startDate;
    LocalDateTime endDate;
    Status status;

    // Thông tin chi tiết từ Subscription
    Long subscriptionId;
    String subscriptionName;
    Double price;
    Integer duration;
    String description;
    Integer maxPost;
    Integer priority;
    Integer postExpiryDays;

    public enum Status {
        ACTIVE,
        EXPIRED
    }
}
