package com.example.SubscriptionService.mapper;

import com.example.SubscriptionService.dto.SubscriptionDTO;
import com.example.SubscriptionService.model.Subscription;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SubscriptionMapper {

    // Subscription to DTO
    default SubscriptionDTO toSubscriptionDTO(Subscription subscription) {
        if (subscription == null) return null;
        return SubscriptionDTO.builder()
                .name(subscription.getName())
                .description(subscription.getDescription())
                .price(subscription.getPrice())
                .duration(subscription.getDuration())
                .maxPost(subscription.getMaxPost())
                .priority(subscription.getPriority())
                .postExpiryDays(subscription.getPostExpiryDays())
                .build();
    }

    // DTO to Subscription
    default Subscription toSubscription(SubscriptionDTO subscriptionDTO) {
        if (subscriptionDTO == null) return null;
        return Subscription.builder()
                .name(subscriptionDTO.name())
                .description(subscriptionDTO.description())
                .price(subscriptionDTO.price())
                .duration(subscriptionDTO.duration())
                .maxPost(subscriptionDTO.maxPost())
                .priority(subscriptionDTO.priority())
                .postExpiryDays(subscriptionDTO.postExpiryDays())
                .build();
    }
}
