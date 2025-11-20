package com.example.ListingService.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PropertyResponse {
    private Long id;
    private String title;
    private Double price;
    private String address;
    private Double longitude;
    private Double latitude;
    private String amenities;
    private String propertyTransactionType;
    private String propertyType;
    private String legalPapers;
    private String description;
    private Integer floorNumber;
    private Integer bedrooms;
    private Integer bathrooms;
    private Double area;

    private String status;
    private Integer priority;
    private LocalDateTime expiresAt;
    private LocalDateTime updatedAt;
    private String rejectReason;

    private Long realtorId;
    private String realtorEmail;
    private String realtorName;
    private String realtorPhone;

    private List<String> imageUrls;
}