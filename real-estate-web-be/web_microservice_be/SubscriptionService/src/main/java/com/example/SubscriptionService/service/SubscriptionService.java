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
    void handleUserCreated(UserCreatedDTO userCreatedDTO);

    boolean createBasicSubscription(Long userId);

    // 1. Lấy thông tin/benefit của một gói subscription CỤ THỂ
    SubscriptionDTO getSubscriptionDetails(Long subscriptionId);

    // 2. Lấy thông tin subscription cụ thể cho admin
    Subscription getSubscriptionById(Long subscriptionId);

    // 3. Lấy thông tin subscription của một USER CỤ THỂ
    UserSubscriptionDetailsDTO getUserSubscriptionDetails(Long userId);

    // 4. Lấy TẤT CẢ các gói subscription
    List<Subscription> getAllActiveSubscriptions();

    // 5. Lay TẤT CẢ các gói subscription (Admin)
    List<Subscription> getAllSubscriptions();

    // 6. TẠO một gói subscription mới (Admin)
    Subscription createSubscriptionPackage(SubscriptionDTO subscriptionDTO);

    // 7. CẬP NHẬT thông tin một gói subscription (Admin)
    Subscription updateSubscriptionPackage(Long subscriptionId, UpdateSubscriptionRequest updateSubscriptionRequest);

    // 8. Hủy subscription hiện tại của user
    void cancelUserSubscription(Long userId);
}
