package com.example.SubscriptionService.dto;

import java.util.Map;

public record EmailNotificationDTO(
        String to,
        String subject,
        String template,
        Long userId,
        Map<String, Object> data
){ }
