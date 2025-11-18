package com.example.SubscriptionService.dto;

import lombok.Builder;

import java.time.LocalDate;

@Builder
public record RevenueStatDTO (
        LocalDate date,
        Double totalRevenue,
        Long totalOrders
) {
}
