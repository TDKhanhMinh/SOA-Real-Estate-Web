package com.example.SubscriptionService.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Table(name = "subscriptions")
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subscription_id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "price")
    private Double price;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "max_post")
    private Integer maxPost;

    @Column(name = "priority")
    private Integer priority;

    @Column(name = "post_expiry_days")
    private Integer postExpiryDays;

    @Column(name = "isActive")
    private Boolean isActive = true;
}
