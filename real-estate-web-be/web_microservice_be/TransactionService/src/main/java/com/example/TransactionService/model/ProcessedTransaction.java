package com.example.TransactionService.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "processed_transactions")
public class ProcessedTransaction {
    @Id
    @Column(name = "subscription_order_id")
    private Long subscriptionOrderId;

    @Column(name = "subscription_id")
    private Long subscriptionId;

    @Column(name = "subscription_name")
    private String subscriptionName;

    @Column(name = "transaction_id")
    private Long transactionId;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;
}
