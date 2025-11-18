package com.example.SubscriptionService.dto;

import lombok.Builder;

@Builder
public record SubscriptionStatDTO (
        Long subscriptionId,
        String subscriptionName,
        Long userCount
) {
}
