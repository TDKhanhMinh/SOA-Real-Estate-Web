package com.example.SubscriptionService.controller;

import com.example.SubscriptionService.dto.RevenueStatDTO;
import com.example.SubscriptionService.dto.SubscriptionDTO;
import com.example.SubscriptionService.dto.SubscriptionStatDTO;
import com.example.SubscriptionService.dto.UserSubscriptionDetailsDTO;
import com.example.SubscriptionService.exception.AppException;
import com.example.SubscriptionService.model.Subscription;
import com.example.SubscriptionService.model.SubscriptionOrder;
import com.example.SubscriptionService.request.UpdateSubscriptionRequest;
import com.example.SubscriptionService.response.ApiResponse;
import com.example.SubscriptionService.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
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

    /**
     * User đăng ký/mua một gói subscription
     */
    @PostMapping("/user/purchase/{subscriptionId}")
    public ResponseEntity<ApiResponse<SubscriptionOrder>> purchaseSubscription(
            @AuthenticationPrincipal String userIdStr, //
            @PathVariable Long subscriptionId) {

        log.info("User {} yêu cầu mua gói {}", userIdStr, subscriptionId);
        Long userId;
        try {
            userId = Long.parseLong(userIdStr);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "Invalid user ID format", null));
        }

        try {
            // Service sẽ trả về kết quả cuối cùng (COMPLETED, FAILED, REVIEW_NEEDED)
            SubscriptionOrder order = subscriptionService.purchaseSubscription(userId, subscriptionId);

            // Xử lý kết quả
            HttpStatus status = HttpStatus.OK;
            String message = "Giao dịch thành công.";

            if (order.getStatus() == SubscriptionOrder.Status.FAILED) {
                status = HttpStatus.BAD_REQUEST; // 400
                message = "Giao dịch thất bại.";
            } else if (order.getStatus() == SubscriptionOrder.Status.REVIEW_NEEDED) {
                status = HttpStatus.ACCEPTED; // 202
                message = "Không thể xác nhận giao dịch, yêu cầu của bạn đang được xem xét.";
            }

            return ResponseEntity.status(status)
                    .body(new ApiResponse<>(status.value(), message, order));

        } catch (AppException e) {
            log.error("Lỗi khi user {} mua gói {}: {}", userId, subscriptionId, e.getErrorCode().getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null));
        } catch (Exception e) {
            log.error("Lỗi hệ thống khi user {} mua gói {}: {}", userId, subscriptionId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống, vui lòng thử lại.", null));
        }
    }

    /**
     * User xem lịch sử mua subscription của mình
     */
    @GetMapping("/user/history")
    public ResponseEntity<ApiResponse<Page<SubscriptionOrder>>> getMyHistory(
            @AuthenticationPrincipal String userIdStr,
            @PageableDefault(page = 0, size = 20, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        try {

            Long userId;
            try {
                userId = Long.parseLong(userIdStr);
            } catch (NumberFormatException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "Invalid user ID format", null));
            }
            Page<SubscriptionOrder> history = subscriptionService.getUserSubscriptionHistory(userId, pageable);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Lấy lịch sử thành công", history));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }

    // ======================================================
    // ENDPOINTS CHO ADMIN (QUẢN TRỊ VIÊN)
    // ======================================================

    /**
     * [Admin] Gán gói thủ công cho user (Không tạo Order, chỉ cập nhật UserSubscription)
     * Dùng để tặng gói, đền bù, hoặc sửa lỗi dữ liệu.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/assign/user/{userId}/{subscriptionId}")
    public ResponseEntity<ApiResponse<Void>> adminAssignSubscription(
            @PathVariable Long userId,
            @PathVariable Long subscriptionId) {
        try {
            subscriptionService.assignSubscriptionToUser(userId, subscriptionId);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                    "Gán gói thành công cho user " + userId, null));
        } catch (AppException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(e.getErrorCode().getCode(), e.getErrorCode().getMessage(), null));
        } catch (Exception e) {
            log.error("Error assigning subscription", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống", null));
        }
    }

    /**
     * [Admin] Duyệt đơn hàng bị treo (REVIEW_NEEDED)
     * Params: ?approve=true (Duyệt) hoặc ?approve=false (Từ chối)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/orders/{orderId}/review")
    public ResponseEntity<ApiResponse<SubscriptionOrder>> reviewOrder(
            @PathVariable Long orderId,
            @RequestParam boolean approve) {
        try {
            SubscriptionOrder updatedOrder = subscriptionService.reviewSubscriptionOrder(orderId, approve);

            String message = approve ? "Đã duyệt đơn hàng thành công." : "Đã từ chối đơn hàng.";
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), message, updatedOrder));

        } catch (AppException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null));
        } catch (Exception e) {
            log.error("Error reviewing order", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống", null));
        }
    }

    /**
     * [Admin] Thống kê doanh thu theo ngày/tháng/năm
     * VD: /subscription/admin/stats/revenue?startDate=2023-01-01&endDate=2023-12-31
     * Kết quả: [{"period": "2023-01", "totalRevenue": 5000}, {"period": "2023-02", "totalRevenue": 7000}]
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/stats/revenue")
    public ResponseEntity<ApiResponse<List<RevenueStatDTO>>> getRevenueStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            List<RevenueStatDTO> stats = subscriptionService.getRevenueStatistics(startDate, endDate);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Lấy thống kê doanh thu thành công", stats));
        } catch (Exception e) {
            log.error("Error getting revenue stats", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống", null));
        }
    }

    /**
     * [Admin] Thống kê số lượng người dùng theo từng gói
     * VD: /subscription/admin/stats/users
     * Kết quả: [{"subscriptionName": "Basic", "userCount": 100}, {"subscriptionName": "VIP", "userCount": 5}]
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/stats/users")
    public ResponseEntity<ApiResponse<List<SubscriptionStatDTO>>> getUserStats() {
        try {
            List<SubscriptionStatDTO> stats = subscriptionService.getUserSubscriptionStats();
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Lấy thống kê người dùng thành công", stats));
        } catch (Exception e) {
            log.error("Error getting user stats", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống", null));
        }
    }

    /**
     * [Admin] Danh sách User đang dùng gói cụ thể
     * VD: /subscription/admin/users?subscriptionId=2&page=0&size=10
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/users")
    public ResponseEntity<ApiResponse<Page<UserSubscriptionDetailsDTO>>> getUsersBySubscription(
            @RequestParam Long subscriptionId,
            @PageableDefault(page = 0, size = 20, sort = "startDate", direction = Sort.Direction.DESC) Pageable pageable) {

        try {
            Page<UserSubscriptionDetailsDTO> users = subscriptionService.getUsersBySubscriptionPackage(subscriptionId, pageable);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Lấy danh sách user theo gói thành công", users));
        } catch (AppException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getMessage(), null));
        } catch (Exception e) {
            log.error("Error searching users by subscription", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống", null));
        }
    }

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
     * [Admin] Xem lịch sử mua gói của 1 user cụ thể
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/user/{userId}/history")
    public ResponseEntity<ApiResponse<Page<SubscriptionOrder>>> getUserHistoryByAdmin(
            @PathVariable Long userId,
            @PageableDefault(sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        try{
            Page<SubscriptionOrder> history = subscriptionService.getUserSubscriptionHistory(userId, pageable);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Lấy lịch sử user thành công", history));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
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
     * [Admin] Xem lịch sử toàn hệ thống (Search & Filter)
     * VD: /subscription/admin/orders?status=COMPLETED&search=test@gmail.com&subscriptionId=2
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/orders")
    public ResponseEntity<ApiResponse<Page<SubscriptionOrder>>> getAllHistory(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) SubscriptionOrder.Status status,
            @RequestParam(required = false) Long subscriptionId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @PageableDefault(page = 0, size = 20, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable) {

        try {
            Page<SubscriptionOrder> history = subscriptionService.getAllSubscriptionHistory(
                    search, status, subscriptionId, startDate, endDate, pageable);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Lấy dữ liệu thành công", history));
        } catch (Exception e) {
            log.error("Error fetching subscription history", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống", null));
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