package com.example.ListingService.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class CreatePropertyRequest {
    @Size(min = 10, max = 200, message = "TITLE_INVALID")
    private String title;

    @Positive(message = "PRICE_INVALID")
    private Double price;

    @Size(max = 500, message = "ADDRESS_TOO_LONG")
    private String address;

    @Min(value = -180, message = "LONGITUDE_INVALID")
    @Max(value = 180, message = "LONGITUDE_INVALID")
    private Double longitude;

    @Min(value = -90, message = "LATITUDE_INVALID")
    @Max(value = 90, message = "LATITUDE_INVALID")
    private Double latitude;

    private String amenities;

    private String propertyTransactionType; // SALE, RENT

    private String propertyType; // APARTMENT, HOUSE...

    private String legalPapers;

    @Size(max = 5000, message = "DESCRIPTION_TOO_LONG")
    private String description;

    @Min(value = 0, message = "FLOOR_NUMBER_INVALID")
    private Integer floorNumber;

    @Min(value = 0, message = "BEDROOMS_INVALID")
    private Integer bedrooms;

    @Min(value = 0, message = "BATHROOMS_INVALID")
    private Integer bathrooms;

    @Positive(message = "AREA_INVALID")
    private Double area;

    private List<String> imageUrls;

    @Email(message = "EMAIL_INVALID")
    @Size(max = 100, message = "EMAIL_TOO_LONG")
    private String email;

    @Size(min = 10, max = 10, message = "PHONE_INVALID")
    @Pattern(regexp = "^(\\+84|0)(3|5|7|8|9)[0-9]{8}$", message = "PHONE_INVALID")
    private String phone;

    @Size(min = 3, message = "NAME_INVALID")
    private String name;
}