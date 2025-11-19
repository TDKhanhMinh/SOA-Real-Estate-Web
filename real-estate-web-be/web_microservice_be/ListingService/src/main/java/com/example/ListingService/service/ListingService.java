package com.example.ListingService.service;

import com.example.ListingService.request.PropertyActionRequest;
import com.example.ListingService.request.CreatePropertyRequest;
import com.example.ListingService.request.UpdatePropertyRequest;
import com.example.ListingService.model.Property;

public interface ListingService {

    // --- USER FEATURE ---

    // Create new property(draft)
    Property createProperty(Long userId, CreatePropertyRequest request);

    // Submit property to review
    void submitProperty(Long userId, Long propertyId);

    // Update property
    Property updateProperty(Long userId, Long propertyId, UpdatePropertyRequest request);

    // Change visibility of property
    void toggleVisibility(Long userId, Long propertyId);

    // Mark property as sold
    void markAsSold(Long userId, Long propertyId);

    // Mark property as rented
    void markAsRented(Long userId, Long propertyId);

    // Delete property (soft delete)
    void deleteProperty(Long userId, Long propertyId);


    // --- ADMIN FEATURE ---

    // Review and approve/reject property
    void approveProperty(Long propertyId, PropertyActionRequest request);
}