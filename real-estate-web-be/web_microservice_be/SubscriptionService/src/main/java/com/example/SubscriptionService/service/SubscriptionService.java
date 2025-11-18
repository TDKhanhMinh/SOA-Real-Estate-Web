package com.example.SubscriptionService.service;

import com.example.SubscriptionService.dto.*;
import com.example.SubscriptionService.model.Subscription;
import com.example.SubscriptionService.model.SubscriptionOrder;
import com.example.SubscriptionService.request.UpdateSubscriptionRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface SubscriptionService {

    // Lấy thông tin/benefit của một gói subscription CỤ THỂ
    SubscriptionDTO getSubscriptionDetails(Long subscriptionId);

    // Lấy thông tin subscription cụ thể cho admin
    Subscription getSubscriptionById(Long subscriptionId);

    // Lấy thông tin subscription của một USER CỤ THỂ
    UserSubscriptionDetailsDTO getUserSubscriptionDetails(Long userId);

    // Lấy TẤT CẢ các gói subscription
    List<Subscription> getAllActiveSubscriptions();

    // Lấy TẤT CẢ các gói subscription (Admin)
    List<Subscription> getAllSubscriptions();

    // TẠO một gói subscription mới (Admin)
    Subscription createSubscriptionPackage(SubscriptionDTO subscriptionDTO);

    // CẬP NHẬT thông tin một gói subscription (Admin)
    Subscription updateSubscriptionPackage(Long subscriptionId, UpdateSubscriptionRequest updateSubscriptionRequest);

    // Hủy subscription hiện tại của user
    void cancelUserSubscription(Long userId);

    // Mua gói subscription
    SubscriptionOrder purchaseSubscription(Long userId, Long subscriptionId);

    // Lấy lịch sử của 1 user (Dùng cho User xem của mình, hoặc Admin xem của 1 user)
    Page<SubscriptionOrder> getUserSubscriptionHistory(Long userId, Pageable pageable);

    // Admin: Lấy lịch sử toàn hệ thống (có filter)
    Page<SubscriptionOrder> getAllSubscriptionHistory(
            String search,
            SubscriptionOrder.Status status,
            Long subscriptionId,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    );

    // Thống kê doanh thu
    List<RevenueStatDTO> getRevenueStatistics(LocalDate startDate, LocalDate endDate);

    // Thống kê phân bố user theo gói subscription
    List<SubscriptionStatDTO> getUserSubscriptionStats();

    // Lấy danh sách user theo gói subscription (Admin)
    Page<UserSubscriptionDetailsDTO> getUsersBySubscriptionPackage(Long subscriptionId, Pageable pageable);

    // Gán gói thủ công (Admin)
    void assignSubscriptionToUser(Long userId, Long subscriptionId);

    // Duyệt đơn hàng đang bị treo (REVIEW_NEEDED)
    SubscriptionOrder reviewSubscriptionOrder(Long orderId, boolean isApproved);
}
