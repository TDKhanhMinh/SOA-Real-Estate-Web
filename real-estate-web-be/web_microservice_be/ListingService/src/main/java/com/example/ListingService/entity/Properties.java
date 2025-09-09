package com.example.ListingService.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "properties")
public class Properties {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "property_id")
    private int propertyId;
    @Column(name = "property_name")
    private String propertyName;
    @Column(name = "property_address")
    private String propertyAddress;
    @Column(name = "property_location")
    private String propertyLocation;
    @Column(name = "property_price")
    private double propertyPrice;
    @Column(name = "property_type")
    private String propertyType;
    @Column(name = "property_is_available")
    private boolean isAvailable;
    @Column(name = "property_description")
    private String propertyDescription;
    @Column(name = "property_status")
    private String propertyStatus;
    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    Collection<Images> listImages;


//    private int realtorId;


}
