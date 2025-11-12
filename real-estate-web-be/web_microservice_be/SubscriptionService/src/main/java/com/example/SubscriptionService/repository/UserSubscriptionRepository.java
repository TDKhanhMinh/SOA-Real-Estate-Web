package com.example.SubscriptionService.repository;

import com.example.SubscriptionService.model.Subscription;
import com.example.SubscriptionService.model.UserSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import com.example.SubscriptionService.dto.UserSubscriptionDetailsDTO;

import java.util.Optional;

@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {
    @Query("SELECT new com.example.SubscriptionService.dto.UserSubscriptionDetailsDTO( " +
            "us.userId, us.startDate, us.endDate, us.status, " + // Các trường từ UserSubscription
            "s.id, s.name, s.price, s.duration, s.description, s.maxPost, s.priority, s.postExpiryDays " + // Các trường từ Subscription
            ") " +
            "FROM UserSubscription us JOIN Subscription s ON us.subscriptionId = s.id " +
            "WHERE us.userId = :userId AND us.status = :status")
    Optional<UserSubscriptionDetailsDTO> findUserSubscriptionDetails(@Param("userId") Long userId, @Param("status") UserSubscription.Status status);

    Optional<UserSubscription> findByUserId(Long userId);
}
