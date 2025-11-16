package com.example.SubscriptionService.service;

import com.example.SubscriptionService.dto.SubscriptionDTO;
import com.example.SubscriptionService.dto.UserCreatedDTO;
import com.example.SubscriptionService.dto.UserSubscriptionDetailsDTO;
import com.example.SubscriptionService.model.Subscription;
import com.example.SubscriptionService.model.UserSubscription;
import com.example.SubscriptionService.request.UpdateSubscriptionRequest;
import com.example.SubscriptionService.response.ApiResponse;

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
}
