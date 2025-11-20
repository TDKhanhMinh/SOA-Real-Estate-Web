package com.example.ListingService.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class UpdatePropertyRequest {

    // Bỏ @NotBlank (Required), chỉ giữ @Size để validate nếu có dữ liệu
    @Size(min = 10, max = 200, message = "TITLE_INVALID")
    private String title;

    // Bỏ @NotNull (Required), chỉ giữ @Positive
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

    @Size(min = 1, message = "PROPERTY_TRANSACTION_TYPE_INVALID")
    private String propertyTransactionType;

    @Size(min = 1, message = "PROPERTY_TYPE_INVALID")
    private String propertyType;

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

    @Size(min = 3, max = 10, message = "IMAGES_QUANTITY_INVALID")
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