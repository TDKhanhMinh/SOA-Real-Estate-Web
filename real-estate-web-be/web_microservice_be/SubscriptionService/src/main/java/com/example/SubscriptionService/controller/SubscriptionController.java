package com.example.SubscriptionService.controller;

import com.example.SubscriptionService.dto.SubscriptionDTO;
import com.example.SubscriptionService.dto.UserSubscriptionDetailsDTO;
import com.example.SubscriptionService.exception.AppException;
import com.example.SubscriptionService.model.Subscription;
import com.example.SubscriptionService.request.UpdateSubscriptionRequest;
import com.example.SubscriptionService.response.ApiResponse;
import com.example.SubscriptionService.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    // Setup Logger giống như UserController
    private static final Logger log = LoggerFactory.getLogger(SubscriptionController.class);
    private final SubscriptionService subscriptionService;

    // ======================================================
    // ENDPOINTS CHO USER (NGƯỜI DÙNG)
    // ======================================================

    /**
     * Lấy tất cả các gói subscription đang "active"
     */
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<Subscription>>> getAllActiveSubscriptions() {
        try {
            List<Subscription> subscriptions = subscriptionService.getAllActiveSubscriptions(); //
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                    "Lấy danh sách các gói đang hoạt động thành công.", subscriptions));
        } catch (Exception e) {
            log.error("Unexpected error fetching active subscriptions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }

    /**
     * Lấy chi tiết một gói subscription theo ID
     */
    @GetMapping("/{subscriptionId}")
    public ResponseEntity<ApiResponse<SubscriptionDTO>> getSubscriptionDetails(@PathVariable Long subscriptionId) {
        try {
            SubscriptionDTO dto = subscriptionService.getSubscriptionDetails(subscriptionId);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                    "Lấy chi tiết gói subscription thành công.", dto));
        } catch (AppException e) {
            log.error("Error fetching subscription details: {}", e.getErrorCode().getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND) // Giống getProfile khi không tìm thấy
                    .body(new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getErrorCode().getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error fetching subscription details", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }

    /**
     * Hủy gói subscription hiện tại của user (chuyển về gói basic)
     */
    @PostMapping("/user/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelUserSubscription(@AuthenticationPrincipal String userIdStr) {
        try {
            Long userId;

            try{
                userId = Long.parseLong(userIdStr);
            } catch (NumberFormatException e) {
                log.error("Invalid user ID format: {}", userIdStr);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "Invalid user ID format", null));
            }

            subscriptionService.cancelUserSubscription(userId); //
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                    "Đã hủy gói subscription và chuyển về gói basic thành công.", null));
        } catch (AppException e) {
            log.error("Error cancelling subscription: {}", e.getErrorCode().getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getErrorCode().getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error cancelling subscription", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }

    /**
     * Lấy thông tin subscription HIỆN TẠI của user
     */
    @GetMapping("/user/")
    public ResponseEntity<ApiResponse<UserSubscriptionDetailsDTO>> getCurrentUserSubscription(
            @AuthenticationPrincipal String userIdStr) {
        try {
            Long userId;

            try{
                userId = Long.parseLong(userIdStr);
            } catch (NumberFormatException e) {
                log.error("Invalid user ID format: {}", userIdStr);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "Invalid user ID format", null));
            }

            UserSubscriptionDetailsDTO details = subscriptionService.getUserSubscriptionDetails(userId); //
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                    "Lấy thông tin subscription hiện tại của user thành công.", details));
        } catch (AppException e) {
            log.error("Error fetching current user subscription: {}", e.getErrorCode().getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getErrorCode().getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error fetching current user subscription", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }

    // ======================================================
    // ENDPOINTS CHO ADMIN (QUẢN TRỊ VIÊN)
    // ======================================================

    /**
     * [Admin] Lấy tất cả các gói (bao gồm cả active/inactive)
     */
    @PreAuthorize("hasRole('ADMIN')") // Giống UserController
    @GetMapping("/admin/")
    public ResponseEntity<ApiResponse<List<Subscription>>> getAllSubscriptions() {
        try {
            List<Subscription> subscriptions = subscriptionService.getAllSubscriptions(); //
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                    "Lấy tất cả gói subscription thành công (Admin).", subscriptions));
        } catch (Exception e) {
            log.error("Unexpected error fetching all subscriptions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }

    /**
     * [Admin] Lấy thông tin chi tiết 1 gói (để xem/sửa)
     */
    @PreAuthorize("hasRole('ADMIN')") // Giống UserController
    @GetMapping("/admin/{subscriptionId}")
    public ResponseEntity<ApiResponse<Subscription>> getSubscriptionById(@PathVariable Long subscriptionId) {
        try {
            Subscription subscription = subscriptionService.getSubscriptionById(subscriptionId); //
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                    "Lấy thông tin gói theo ID thành công (Admin).", subscription));
        } catch (AppException e) {
            log.error("Error fetching subscription by ID: {}", e.getErrorCode().getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND) // Giống getUserById
                    .body(new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getErrorCode().getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error fetching subscription by ID", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }

    /**
     * [Admin] Tạo một gói subscription mới
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin")
    public ResponseEntity<ApiResponse<Subscription>> createSubscriptionPackage(
            @Validated @RequestBody SubscriptionDTO subscriptionDTO) {
        try {
            Subscription newSubscription = subscriptionService.createSubscriptionPackage(subscriptionDTO); //
            return ResponseEntity.status(HttpStatus.CREATED) // Giống /register
                    .body(new ApiResponse<>(HttpStatus.CREATED.value(),
                            "Tạo gói subscription mới thành công.", newSubscription));
        } catch (AppException e) { // Bắt lỗi validation hoặc logic
            log.error("Error creating subscription package", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getErrorCode().getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error creating subscription package", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }

    /**
     * [Admin] Cập nhật thông tin một gói subscription
     */
    @PreAuthorize("hasRole('ADMIN')") // Giống UserController
    @PutMapping("/admin/{subscriptionId}")
    public ResponseEntity<ApiResponse<Subscription>> updateSubscriptionPackage(
            @PathVariable Long subscriptionId,
            @Validated @RequestBody UpdateSubscriptionRequest request) { // Giống @Validated @RequestBody
        try {
            Subscription updatedSubscription = subscriptionService.updateSubscriptionPackage(subscriptionId, request); //
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                    "Cập nhật gói subscription thành công.", updatedSubscription));
        } catch (AppException e) {
            log.error("Error updating subscription package", e);
            // Giống updateUser, có thể trả về NOT_FOUND hoặc BAD_REQUEST
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getErrorCode().getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error updating subscription package", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }

    /**
     * [Admin] Lấy thông tin subscription HIỆN TẠI của một user
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<UserSubscriptionDetailsDTO>> getUserSubscription(@PathVariable Long userId) {
        try {
            UserSubscriptionDetailsDTO details = subscriptionService.getUserSubscriptionDetails(userId); //
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                    "Lấy thông tin subscription của user thành công.", details));
        } catch (AppException e) {
            log.error("Error fetching user subscription: {}", e.getErrorCode().getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getErrorCode().getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error fetching user subscription", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }
}