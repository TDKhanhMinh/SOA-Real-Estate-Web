package com.example.ListingService.service;

import com.example.ListingService.request.PropertyActionRequest;
import com.example.ListingService.request.CreatePropertyRequest;
import com.example.ListingService.request.UpdatePropertyRequest;
import com.example.ListingService.model.Property;
import com.example.ListingService.response.PropertyResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ListingService {

    // --- USER FEATURE ---

    // Create new property(draft)
    PropertyResponse createProperty(Long userId, CreatePropertyRequest request);

    // Submit property to review
    void submitProperty(Long userId, Long propertyId);

    // Update property
    PropertyResponse updateProperty(Long userId, Long propertyId, UpdatePropertyRequest request);

    // Change visibility of property
    void toggleVisibility(Long userId, Long propertyId);

    // Mark property as sold
    void markAsSold(Long userId, Long propertyId);

    // Mark property as rented
    void markAsRented(Long userId, Long propertyId);

    // Delete property (soft delete)
    void deleteProperty(Long userId, Long propertyId);

    // Get my listings with filters
    Page<PropertyResponse> getMyListings(Long userId, String search, Property.Status status, Pageable pageable);

    // Get my sold/rent listings with filters
    Page<PropertyResponse> getMySoldRentListings(Long userId, String search, Property.Status status, Pageable pageable);

    // Get my listing detail
    PropertyResponse getMyListingDetail(Long userId, Long propertyId);

    // --- ADMIN FEATURE ---

    // Review and approve/reject property
    void approveProperty(Long propertyId, PropertyActionRequest request);

    // Get pending listings for review
    Page<PropertyResponse> getPendingListings(String search, Pageable pageable);

    // Get user listings by admin with filters
    Page<PropertyResponse> getUserListingsByAdmin(Long userId, String search, Property.Status status, boolean includeDeleted, Pageable pageable);

    // Get listing detail by admin
    PropertyResponse getListingDetailByAdmin(Long propertyId);

    // --- PUBLIC FEATURE (KHÔNG CẦN LOGIN) ---

    // Lấy danh sách bài đăng khả dụng (AVAILABLE)
    Page<PropertyResponse> getPublicListings(String search,
                                     String propertyTransactionType,
                                     String propertyType,
                                     Double minPrice, Double maxPrice,
                                     Pageable pageable);

    // Xem chi tiết bài đăng (chỉ bài AVAILABLE)
    PropertyResponse getPublicListingDetail(Long propertyId);
}