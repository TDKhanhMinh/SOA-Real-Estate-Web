package com.example.SubscriptionService.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "rental_listing")
public class RentalListings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rental_listing_id")
    private int rentalListingId;

    @Column(name = "rental_price")
    private double rentalPrice;
    @Column(name = "lease_start_date")
    private Date leaseStartDate;

    @Column(name = "lease_end_date")
    private Date leaseEndDate;
    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    private Date createdAt;
    @Column(name = "updated_at")
    private Date updatedAt;


    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rental_agreement_id", referencedColumnName = "rental_agreement_id")
    private RentalAgreements rentalAgreements;



//    private int realtorId;
}
