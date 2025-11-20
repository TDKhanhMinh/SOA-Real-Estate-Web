package com.example.ListingService.controller;

import com.example.ListingService.response.ApiResponse;
import com.example.ListingService.exception.AppException;
import com.example.ListingService.model.Property;
import com.example.ListingService.request.CreatePropertyRequest;
import com.example.ListingService.request.PropertyActionRequest;
import com.example.ListingService.request.UpdatePropertyRequest;
import com.example.ListingService.response.PropertyResponse;
import com.example.ListingService.service.ListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/listing")
@RequiredArgsConstructor
public class ListingController {

    private static final Logger log = LoggerFactory.getLogger(ListingController.class);
    private final ListingService listingService;

    // ======================================================
    // ENDPOINTS CHO USER (NGƯỜI DÙNG)
    // ======================================================

    /**
     *  User tạo bài đăng mới (Lưu nháp - DRAFT)
     */
    @PostMapping("/property")
    public ResponseEntity<ApiResponse<PropertyResponse>> createProperty(
            @AuthenticationPrincipal String userIdStr,
            @Valid @RequestBody CreatePropertyRequest request) {

        try {
            Long userId = parseUserId(userIdStr);
            PropertyResponse property = listingService.createProperty(userId, request);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(HttpStatus.CREATED.value(), "Tạo bản nháp thành công", property));

        } catch (AppException e) {
            log.error("Error creating property: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error creating property", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống", null));
        }
    }

    /**
     *  User cập nhật bài đăng
     * - Logic tự động chuyển về DRAFT nếu bài đang chạy hoặc đã bán
     */
    @PutMapping("/property/{id}")
    public ResponseEntity<ApiResponse<PropertyResponse>> updateProperty(
            @AuthenticationPrincipal String userIdStr,
            @PathVariable Long id,
            @Valid @RequestBody UpdatePropertyRequest request) {

        try {
            Long userId = parseUserId(userIdStr);
            PropertyResponse updatedProperty = listingService.updateProperty(userId, id, request);

            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                    "Cập nhật bài đăng thành công", updatedProperty));

        } catch (AppException e) {
            log.error("Error updating property {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error updating property", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống", null));
        }
    }

    /**
     *  User gửi yêu cầu duyệt bài (ĐĂNG TIN)
     * - Gọi sang Subscription Service để check quota
     */
    @PostMapping("/property/{id}/submit")
    public ResponseEntity<ApiResponse<Void>> submitProperty(
            @AuthenticationPrincipal String userIdStr,
            @PathVariable Long id) {

        try {
            Long userId = parseUserId(userIdStr);
            listingService.submitProperty(userId, id);

            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                    "Đã gửi yêu cầu đăng tin thành công", null));

        } catch (AppException e) {
            log.warn("Error submitting property {}: {}", id, e.getMessage());
            // Các lỗi như hết hạn gói, hết lượt post thường trả về 402 hoặc 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error submitting property", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống", null));
        }
    }

    /**
     *  User ẩn / hiện bài đăng (Toggle Visibility)
     */
    @PostMapping("/property/{id}/toggle-visibility")
    public ResponseEntity<ApiResponse<Void>> toggleVisibility(
            @AuthenticationPrincipal String userIdStr,
            @PathVariable Long id) {

        try {
            Long userId = parseUserId(userIdStr);
            listingService.toggleVisibility(userId, id);

            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                    "Thay đổi trạng thái hiển thị thành công", null));

        } catch (AppException e) {
            log.error("Error toggling visibility for property {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error toggling visibility", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống", null));
        }
    }

    /**
     *  User xác nhận đã Bán (SOLD)
     */
    @PostMapping("/property/{id}/sold")
    public ResponseEntity<ApiResponse<Void>> markAsSold(
            @AuthenticationPrincipal String userIdStr,
            @PathVariable Long id) {

        try {
            Long userId = parseUserId(userIdStr);

            listingService.markAsSold(userId, id);

            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                    "Đã xác nhận bán thành công", null));

        } catch (AppException e) {
            log.error("Error marking property {} as sold: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error marking property as sold", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống", null));
        }
    }

    /**
     *  User xác nhận đã Cho Thuê (RENTED)
     */
    @PostMapping("/property/{id}/rented")
    public ResponseEntity<ApiResponse<Void>> markAsRented(
            @AuthenticationPrincipal String userIdStr,
            @PathVariable Long id) {

        try {
            Long userId = parseUserId(userIdStr);
            listingService.markAsRented(userId, id);

            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                    "Đã xác nhận cho thuê thành công", null));

        } catch (AppException e) {
            log.error("Error marking property {} as rented: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error marking property as rented", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống", null));
        }
    }

    /**
     *  User xóa bài đăng (Soft Delete)
     */
    @DeleteMapping("/property/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProperty(
            @AuthenticationPrincipal String userIdStr,
            @PathVariable Long id) {

        try {
            Long userId = parseUserId(userIdStr);
            listingService.deleteProperty(userId, id);

            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                    "Đã xóa bài đăng thành công", null));

        } catch (AppException e) {
            log.error("Error deleting property {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error deleting property", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống", null));
        }
    }

    /**
     * Lấy danh sách bài đăng của bản thân với bộ lọc
     */
    @GetMapping("/my-listings")
    public ResponseEntity<ApiResponse<Page<PropertyResponse>>> getMyListings(
            @AuthenticationPrincipal String userIdStr,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Property.Status status,
            @PageableDefault(page = 0, size = 20, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Long userId = parseUserId(userIdStr);
        Page<PropertyResponse> page = listingService.getMyListings(userId, search, status, pageable);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Lấy danh sách thành công", page));
    }

    /**
     * User xem lịch sử giao dịch (SOLD/RENTED)
     */
    @GetMapping("/my-history")
    public ResponseEntity<ApiResponse<Page<PropertyResponse>>> getMySoldRentListings(
            @AuthenticationPrincipal String userIdStr,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Property.Status status,
            @PageableDefault(page = 0, size = 20, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Long userId = parseUserId(userIdStr);
        Page<PropertyResponse> page = listingService.getMySoldRentListings(userId, search, status, pageable);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Lấy lịch sử giao dịch thành công", page));
    }

    /**
     * User xem chi tiết bài đăng của mình
     */
    @GetMapping("/property/{id}")
    public ResponseEntity<ApiResponse<PropertyResponse>> getMyListingDetail(
            @AuthenticationPrincipal String userIdStr,
            @PathVariable Long id) {

        Long userId = parseUserId(userIdStr);
        PropertyResponse property = listingService.getMyListingDetail(userId, id);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Lấy chi tiết thành công", property));
    }

    // ======================================================
    // ENDPOINTS CHO ADMIN (QUẢN TRỊ VIÊN)
    // ======================================================

    /**
     * Admin xem danh sách tất cả bài đăng với bộ lọc
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/properties")
    public ResponseEntity<ApiResponse<Page<PropertyResponse>>> getAllListingsForAdmin(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Property.Status status,
            @RequestParam(defaultValue = "false") boolean includeDeleted,
            @PageableDefault(page = 0, size = 20, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable) {

        // Gọi Service với userId = null (để lấy tất cả)
        Page<PropertyResponse> page = listingService.getUserListingsByAdmin(
                null, search, status, includeDeleted, pageable);

        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                "Lấy danh sách toàn bộ bài đăng thành công", page));
    }

    /**
     * Admin xem danh sách bài CHỜ DUYỆT (Pending)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/property/pending")
    public ResponseEntity<ApiResponse<Page<PropertyResponse>>> getPendingListings(
            @RequestParam(required = false) String search,
            @PageableDefault(page = 0, size = 20, sort = "updatedAt", direction = Sort.Direction.ASC) Pageable pageable) { // Cũ nhất lên đầu để duyệt trước

        Page<PropertyResponse> page = listingService.getPendingListings(search, pageable);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Lấy danh sách chờ duyệt thành công", page));
    }

    /**
     * Admin xem danh sách bài đăng của user với bộ lọc
     * VD: /listing/admin/user/{userId}/properties?includeDeleted=false&status=AVAILABLE&search=Hà Nội
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/user/{userId}/properties")
    public ResponseEntity<ApiResponse<Page<PropertyResponse>>> getUserListingsByAdmin(
            @PathVariable Long userId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Property.Status status,
            @RequestParam(defaultValue = "false") boolean includeDeleted,
            @PageableDefault(page = 0, size = 20, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<PropertyResponse> page = listingService.getUserListingsByAdmin(
                userId, search, status, includeDeleted, pageable); // Truyền tham số vào

        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Lấy danh sách bài đăng thành công", page));
    }

    /**
     *  Admin xem chi tiết bài đăng
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/property/{id}")
    public ResponseEntity<ApiResponse<PropertyResponse>> getListingDetailByAdmin(@PathVariable Long id) {
        PropertyResponse property = listingService.getListingDetailByAdmin(id);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Lấy chi tiết thành công", property));
    }

    /**
     *  Admin Duyệt / Từ chối bài đăng
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/property/{id}/approve")
    public ResponseEntity<ApiResponse<Void>> approveProperty(
            @PathVariable Long id,
            @RequestBody PropertyActionRequest request) {

        try {
            listingService.approveProperty(id, request);

            String msg = request.isApproved() ? "Đã duyệt bài đăng" : "Đã từ chối bài đăng";
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), msg, null));

        } catch (AppException e) {
            log.error("Error approving property {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error approving property", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống", null));
        }
    }

    // Helper: Parse User ID từ String sang Long
    private Long parseUserId(String userIdStr) {
        try {
            return Long.parseLong(userIdStr);
        } catch (NumberFormatException e) {
            // Ném RuntimeException để catch ở tầng trên hoặc GlobalExceptionHandler
            throw new IllegalArgumentException("User ID không hợp lệ");
        }
    }

    // ======================================================
    // PUBLIC ENDPOINTS (KHÔNG CẦN LOGIN)
    // ======================================================

    /**
     * Public: Tìm kiếm bài đăng
     * Mặc định sắp xếp: Priority (ASC) -> UpdatedAt (DESC)
     * VD: /listings/public?transactionType=SALE&search=Hà Nội&sort=priority,asc&sort=updatedAt,desc
     */
    @GetMapping("/public")
    public ResponseEntity<ApiResponse<Page<PropertyResponse>>> getPublicListings(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String transactionType,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @PageableDefault(page = 0, size = 20, sort = {"priority", "updatedAt"}, direction = Sort.Direction.ASC) Pageable pageable) {

        // Lưu ý: Direction ASC ở trên sẽ áp dụng cho cả 2 nếu không chỉ rõ.
        // Tuy nhiên, client có thể ghi đè bằng query param: ?sort=priority,asc&sort=updatedAt,desc

        Page<PropertyResponse> page = listingService.getPublicListings(search, transactionType, propertyType, minPrice, maxPrice, pageable);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Lấy danh sách thành công", page));
    }

    /**
     * Public: Xem chi tiết bài đăng
     */
    @GetMapping("/public/{id}")
    public ResponseEntity<ApiResponse<PropertyResponse>> getPublicListingDetail(@PathVariable Long id) {
        PropertyResponse property = listingService.getPublicListingDetail(id);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Lấy chi tiết thành công", property));
    }
}