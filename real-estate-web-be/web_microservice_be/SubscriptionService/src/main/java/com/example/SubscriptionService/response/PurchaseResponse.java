package com.example.SubscriptionService.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PurchaseResponse {
    private Long transactionId;
    private Long userId;
    private String email;
    private String userName;
    private Double amount;
    private Status status;
    private LocalDateTime createdAt;

    private Long subscriptionOrderId;

    public enum Status {
        PENDING,
        COMPLETED,
        FAILED
    }
}