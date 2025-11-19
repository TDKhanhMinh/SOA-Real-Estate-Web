package com.example.ListingService.mapper;

import com.example.ListingService.model.Property;
import com.example.ListingService.model.PropertyImage;
import com.example.ListingService.repository.PropertyImageRepository;
import com.example.ListingService.response.PropertyResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PropertyMapper {

    private final PropertyImageRepository propertyImageRepository;

    public PropertyResponse toPropertyResponse(Property property) {
        if (property == null) {
            return null;
        }

        // 1. Lấy danh sách ảnh từ DB dựa vào propertyId
        List<String> imageUrls = propertyImageRepository.findByPropertyId(property.getId())
                .stream()
                .map(PropertyImage::getImageUrl)
                .collect(Collectors.toList());

        // 2. Map dữ liệu từ Entity sang Response DTO
        return PropertyResponse.builder()
                .id(property.getId())
                .title(property.getTitle())
                .price(property.getPrice())
                .address(property.getAddress())
                .longitude(property.getLongitude())
                .latitude(property.getLatitude())
                .amenities(property.getAmenities())
                .propertyTransactionType(property.getPropertyTransactionType())
                .propertyType(property.getPropertyType())
                .legalPapers(property.getLegalPapers())
                .description(property.getDescription())
                .floorNumber(property.getFloorNumber())
                .bedrooms(property.getBedrooms())
                .bathrooms(property.getBathrooms())
                .area(property.getArea())
                .status(property.getStatus() != null ? property.getStatus().name() : null)
                .priority(property.getPriority())
                .expiresAt(property.getExpiresAt())
                .updatedAt(property.getUpdatedAt())
                .rejectReason(property.getRejectReason())
                .realtorId(property.getRealtorId())
                .realtorEmail(property.getRealtorEmail())
                .imageUrls(imageUrls) // Gán danh sách ảnh đã lấy
                .build();
    }
}