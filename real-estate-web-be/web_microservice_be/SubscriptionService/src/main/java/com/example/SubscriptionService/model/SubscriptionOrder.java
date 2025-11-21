package com.example.SubscriptionService.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "subscription_orders")
public class SubscriptionOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "email")
    private String email;

    @Column(name = "subscription_id")
    private Long subscriptionId;

    @Column(name = "subscription_name")
    private String subscriptionName;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "max_post")
    private Integer maxPost;

    @Column(name = "priority")
    private Integer priority;

    @Column(name = "post_expiry_days")
    private Integer postExpiryDays;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    public enum Status {
        PENDING,
        COMPLETED,
        FAILED,
        REVIEW_NEEDED
    }
}
