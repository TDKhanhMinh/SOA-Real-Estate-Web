package com.example.TransactionService.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "commission")
public class Commissions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "commission_id")
    private int commissionId;
    @Column(name = "rate")
    private double rate;
    @Column(name = "commission_amount")
    private double amount;
    @OneToOne(mappedBy = "commission", cascade = CascadeType.ALL, orphanRemoval = true)
    private Payment payment;


}
