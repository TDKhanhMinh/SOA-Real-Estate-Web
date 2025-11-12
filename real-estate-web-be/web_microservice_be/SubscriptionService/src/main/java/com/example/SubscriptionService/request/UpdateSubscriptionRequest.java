package com.example.SubscriptionService.request;

import lombok.Builder;

@Builder
public record UpdateSubscriptionRequest (
        String name,
        Double price,
        Integer duration,
        String description,
        Integer maxPost,
        Integer priority,
        Integer postExpiryDays,
        Boolean isActive
) { }
