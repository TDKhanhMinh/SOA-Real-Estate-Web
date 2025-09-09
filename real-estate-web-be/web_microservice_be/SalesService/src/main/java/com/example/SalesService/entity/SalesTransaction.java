package com.example.SalesService.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.util.List;
import java.util.Properties;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sales_transaction")
public class SalesTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private int transactionId;

    @Column(name = "price")
    private double price;

    @Column(name = "status")
    private String status;

    @Column(name = "trans_date")
    private Date transactionDate;
    @ManyToOne
    @JoinColumn(name = "properties_id")
    private Properties properties;


}
