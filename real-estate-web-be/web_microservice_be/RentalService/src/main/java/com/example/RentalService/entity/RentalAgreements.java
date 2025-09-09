package com.example.RentalService.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "rental_agreement")
public class RentalAgreements {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rental_agreement_id")
    private int rentalAgreementId;
    @Column(name = "rental_term")
    private String rentalTerm;
    @Column(name = "sign_at")
    private Date signAt;
    @Column(name = "is_active")
    private boolean isActive;
    @OneToOne(mappedBy = "rentalAgreements", cascade = CascadeType.ALL, orphanRemoval = true)
    private RentalListings rentalListings;


}
