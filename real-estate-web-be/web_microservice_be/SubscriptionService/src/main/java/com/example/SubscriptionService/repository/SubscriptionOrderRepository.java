package com.example.SubscriptionService.repository;

import com.example.SubscriptionService.model.Subscription;
import com.example.SubscriptionService.model.SubscriptionOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionOrderRepository extends JpaRepository<SubscriptionOrder, Long> {
}
