package com.example.TransactionService.controller;

import com.example.TransactionService.model.Transaction;
import com.example.TransactionService.model.Wallet;
import com.example.TransactionService.request.TopUpRequest;
import com.example.TransactionService.response.ApiResponse;
import com.example.TransactionService.response.TopUpResponse;
import com.example.TransactionService.service.TransactionService;
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

@RestController
@RequestMapping("/transaction")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;
    private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);

    // ======================================================
    // ENDPOINTS CHO USER (NGƯỜI DÙNG)
    // ======================================================

    /**
     * User nạp tiền vào tài khoản ví
     */

    @PostMapping("/top-up")
    public ResponseEntity<ApiResponse<TopUpResponse>> topUpAccount(@AuthenticationPrincipal String userIdStr, @Validated @RequestBody TopUpRequest topUpRequest) {
        logger.info("Nhận yêu cầu nạp tiền vào tài khoản"+userIdStr);
        if (userIdStr == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(HttpStatus.UNAUTHORIZED.value(), "Không tìm thấy thông tin người dùng", null));
        }
        Long userId = Long.parseLong(userIdStr);

        try {
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Nạp tiền thành công", transactionService.topUpWallet(userId, topUpRequest)));
        } catch (IllegalArgumentException e) {
            logger.error("Lỗi khi nạp tiền vào tài khoản: {}", e.getMessage());
            ApiResponse<TopUpResponse> apiResponse = new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "Nạp tiền thất bại: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(apiResponse);
        } catch (Exception e) {
            logger.error("Lỗi khi nạp tiền vào tài khoản: {}", e.getMessage());
            ApiResponse<TopUpResponse> apiResponse = new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Nạp tiền thất bại do lỗi hệ thống", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    /**
     * User xem lịch sử nạp tiền
     * Sắp xếp: /history/top-up?sort=createdAt,asc (cũ nhất) hoặc /history/top-up?sort=createdAt,desc
     */
    @GetMapping("/history/top-up")
    public ResponseEntity<ApiResponse<Page<Transaction>>> getMyTopUpHistory(
            @AuthenticationPrincipal String userIdStr,
            @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Long userId = Long.parseLong(userIdStr);
        Page<Transaction> history = transactionService.getTransactionHistoryByType(userId, Transaction.TransactionType.TOP_UP, pageable);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Lấy lịch sử nạp tiền thành công", history));
    }

    /**
     * User xem lịch sử mua subscription
     */
    @GetMapping("/history/purchase")
    public ResponseEntity<ApiResponse<Page<Transaction>>> getMyPurchaseHistory(
            @AuthenticationPrincipal String userIdStr,
            @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Long userId = Long.parseLong(userIdStr);
        Page<Transaction> history = transactionService.getTransactionHistoryByType(userId, Transaction.TransactionType.PURCHASE_SUBSCRIPTION, pageable);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Lấy lịch sử mua gói thành công", history));
    }

    // ======================================================
    // ENDPOINTS CHO ADMIN (QUẢN TRỊ VIÊN)
    // ======================================================

    /**
     * Admin xem ví của 1 user cụ thể
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/user/{userId}/wallet")
    public ResponseEntity<ApiResponse<Wallet>> getWalletByUserId(@PathVariable Long userId) {
        try {
            Wallet wallet = transactionService.getWalletByUserId(userId);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Lấy thông tin ví thành công", wallet));
        } catch (Exception e) {
            logger.error("Admin lỗi khi lấy ví cho user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getMessage(), null));
        }
    }

    /**
     * Admin xem TẤT CẢ lịch sử (top-up và purchase) của 1 user
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/user/{userId}/history")
    public ResponseEntity<ApiResponse<Page<Transaction>>> getAllHistoryByUserId(
            @PathVariable Long userId,
            @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<Transaction> history = transactionService.getAllTransactionHistoryByUserId(userId, pageable);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Lấy tất cả lịch sử cho user " + userId + " thành công", history));
    }

    /**
     * Admin xem tất cả giao dịch NẠP TIỀN (filter và search)
     * VD: /admin/top-up/all?search=test@gmail.com&status=COMPLETED&startDate=2023-01-01&sort=amount,desc
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/top-up/all")
    public ResponseEntity<ApiResponse<Page<Transaction>>> searchAllTopUpTransactions(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Transaction.Status status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @PageableDefault(page = 0, size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        try {
            Page<Transaction> transactions = transactionService.getAllTopUpTransactions(search, status, startDate, endDate, pageable);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Lấy danh sách giao dịch nạp tiền thành công", transactions));
        } catch (Exception e) {
            logger.error("Lỗi khi admin tìm kiếm giao dịch nạp tiền: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}