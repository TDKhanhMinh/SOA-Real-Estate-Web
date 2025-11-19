package com.example.ListingService.request;

import lombok.Data;

@Data
public class PropertyActionRequest {
    private boolean approved;

    private String rejectReason;
}