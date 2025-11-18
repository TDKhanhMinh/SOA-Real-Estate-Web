package com.example.SubscriptionService.repository;

import com.example.SubscriptionService.dto.SubscriptionStatDTO;
import com.example.SubscriptionService.model.UserSubscription;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import com.example.SubscriptionService.dto.UserSubscriptionDetailsDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {
    @Query("SELECT new com.example.SubscriptionService.dto.UserSubscriptionDetailsDTO( " +
            "us.userId, us.email, us.startDate, us.endDate, us.status, " + // Các trường từ UserSubscription
            "s.id, s.name, s.price, s.duration, s.description, s.maxPost, s.priority, s.postExpiryDays " + // Các trường từ Subscription
            ") " +
            "FROM UserSubscription us JOIN Subscription s ON us.subscriptionId = s.id " +
            "WHERE us.userId = :userId AND us.status = :status")
    Optional<UserSubscriptionDetailsDTO> findUserSubscriptionDetails(@Param("userId") Long userId, @Param("status") UserSubscription.Status status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<UserSubscription> findByUserId(Long userId);

    // Thống kê số user theo từng gói subscription
    @Query("SELECT new com.example.SubscriptionService.dto.SubscriptionStatDTO(s.id, s.name, COUNT(us)) " +
            "FROM UserSubscription us, Subscription s " + // Liệt kê cả 2 bảng
            "WHERE us.subscriptionId = s.id " + // Điều kiện join thủ công
            "AND us.status = 'ACTIVE' " +
            "GROUP BY s.id, s.name")
    List<SubscriptionStatDTO> getUserStatsBySubscription();

    // Tìm danh sách user đang dùng gói cụ thể
    Page<UserSubscription> findBySubscriptionIdAndStatus(Long subscriptionId, UserSubscription.Status status, Pageable pageable);

    // Tìm các subscription đã hết hạn (trừ gói miễn phí có id = 1)
    @Query("SELECT us FROM UserSubscription us " +
            "WHERE us.status = 'ACTIVE' " +
            "AND us.endDate < :now " +
            "AND us.subscriptionId <> 1")
    List<UserSubscription> findExpiredSubscriptions(@Param("now") LocalDateTime now);
}
