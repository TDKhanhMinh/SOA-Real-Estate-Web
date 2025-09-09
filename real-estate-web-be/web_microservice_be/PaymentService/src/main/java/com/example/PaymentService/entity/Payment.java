package com.example.PaymentService.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "transactions")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private int transactionId;
    @Column(name = "transaction_amount")
    private int amount;
    @Column(name = "transaction_date")
    private Date date;
    @Column(name = "status")
    private String status;
    @Column(name = "payment_method")
    private String paymentMethod;


    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "commission", referencedColumnName = "commission_id")
    private Commissions commission;

}
