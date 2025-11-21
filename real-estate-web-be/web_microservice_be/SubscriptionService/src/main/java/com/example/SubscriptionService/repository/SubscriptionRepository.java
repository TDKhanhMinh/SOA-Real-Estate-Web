package com.example.SubscriptionService.repository;

import com.example.SubscriptionService.model.Subscription;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByIsActive(boolean isActive);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Subscription> findByIdAndIsActive(Long id, Boolean isActive);
}
