package com.example.ListingService.model;

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
@Table(name = "properties")
@Builder
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "property_id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "price")
    private Double price;

    @Column(name = "address")
    private String address;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "amenities")
    private String amenities;

    @Column(name = "property_transaction_type")
    private String propertyTransactionType;

    @Column(name = "property_type")
    private String propertyType;

    @Column(name = "legal_papers")
    private String legalPapers;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "floor_number")
    private Integer floorNumber;

    @Column(name = "bedrooms")
    private Integer bedrooms;

    @Column(name = "bathrooms")
    private Integer bathrooms;

    @Column(name = "area")
    private Double area;

    @Column(name = "priority")
    private Integer priority;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    @Column(name = "reject_reason", columnDefinition = "TEXT")
    private String rejectReason;

    @Column(name = "realtor_id")
    private Long realtorId;

    @Column(name = "realtor_email")
    private String realtorEmail;

    @Column(name = "realtor_phone")
    private String realtorPhone;

    @Column(name = "realtor_name")
    private String realtorName;

    public enum Status {
        PENDING_APPROVAL,
        AVAILABLE,
        SOLD,
        RENTED,
        EXPIRED,
        REJECTED,
        HIDDEN,
        DRAFT
    }
}

