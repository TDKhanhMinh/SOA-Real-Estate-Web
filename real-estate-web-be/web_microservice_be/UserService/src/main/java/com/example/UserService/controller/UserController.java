package com.example.UserService.controller;

import com.example.UserService.exception.AppException;
import com.example.UserService.request.*;
import com.example.UserService.response.ApiResponse;
import com.example.UserService.response.PageResponse;
import com.example.UserService.response.UserResponse;
import com.example.UserService.model.User;
import com.example.UserService.service.UserService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.example.UserService.dto.UserDTO;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;


@RestController
@RequestMapping("/user")
@AllArgsConstructor
public class UserController {
    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    @GetMapping("/test/hello")
    public String hello() {
        return "Hello, secured world!";
    }

    /**
     *  Đăng ký người dùng mới
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDTO>> register(@Validated @RequestBody RegisterRequest registerRequest) {
        try{
            User user = new User();
            user.setName(registerRequest.getName());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(registerRequest.getPassword());
            user.setPhone(registerRequest.getPhone());
            user.setRole(User.Role.REALTOR);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(HttpStatus.CREATED.value(), "User registered successfully", userService.register(user)));
        } catch (AppException e){
            log.error("Error during registration", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(HttpStatus.BAD_REQUEST.value(), e.getErrorCode().getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error during registration", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }

    /**
     *  Đăng nhập
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest request) {
        try {
            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());

            return ResponseEntity.ok(new ApiResponse(HttpStatus.OK.value(), "Login successful", userService.verify(user)));
        } catch (AppException e) {
            log.error("Error during login", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(HttpStatus.BAD_REQUEST.value(), e.getErrorCode().getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error during login", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }

    /**
     * [Admin] Lấy danh sách tất cả người dùng
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getAllUsers(
            @PageableDefault(page = 0, size = 10, sort = "id", direction = Sort.Direction.ASC)
            Pageable pageable
    ) {
        try{
            PageResponse<UserResponse> users = userService.getAllUsers(pageable);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Get list users success", users));
        } catch (AppException e){
            log.error("Error fetching users", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        } catch (Exception e) {
            log.error("Unexpected error fetching users", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }

    /**
     * [Admin] Tìm kiếm người dùng theo tên hoặc email
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> searchUsers(@RequestParam(required = false) String keyword,
                                                                       @PageableDefault(page = 0, size = 10, sort = "id", direction = Sort.Direction.ASC)
                                                                       Pageable pageable) {
        try{
            PageResponse<UserResponse> users = userService.searchUsers(keyword, pageable);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Search users success", users));
        } catch (AppException e){
            log.error("Error searching users", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        } catch (Exception e) {
            log.error("Unexpected error searching users", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }

        /**
        * [Admin] Lấy thông tin người dùng theo ID
        */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        try{
            UserResponse user = userService.getUserById(id);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Get user success", user));
        } catch (AppException e){
            log.error("Error fetching user by ID", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getErrorCode().getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error fetching user by ID", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }

    /**
     * Lấy thông tin profile của người dùng hiện tại
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> getProfile(@AuthenticationPrincipal String userIdStr) {
        try{
            Long id;
            try {
                id = Long.parseLong(userIdStr);
            } catch (NumberFormatException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "Invalid user ID", null));
            }

            UserDTO user = userService.getUserProfile(id);

            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Get profile success", user));
        } catch (AppException e){
            log.error("Error fetching profile", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getErrorCode().getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error fetching profile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }

    /**
     * [Admin] Cập nhật thông tin người dùng theo ID
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@Validated @RequestBody UpdateRequest updateRequest,
                                                                @PathVariable Long id) {
        try{
            UserResponse updatedUser = userService.updateUser(updateRequest, id);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Update user success", updatedUser));
        } catch (AppException e){
            log.error("Error updating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getErrorCode().getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error updating user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }

    /**
     * Cập nhật thông tin profile của người dùng hiện tại
     */
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(@Validated @RequestBody UpdateProfileRequest updateProfileRequest,
                                                                @AuthenticationPrincipal String userIdStr) {
        try{
            Long id;
            try {
                id = Long.parseLong(userIdStr);
            } catch (NumberFormatException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "Invalid user ID", null));
            }

            UserDTO updatedUser = userService.updateProfile(updateProfileRequest, id);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Update profile success", updatedUser));
        } catch (AppException e){
            log.error("Error updating profile", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getErrorCode().getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error updating profile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }

    /**
     * Đổi mật khẩu cho người dùng hiện tại
     */
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Validated @RequestBody ChangePasswordRequest changePasswordRequest,
                                                            @AuthenticationPrincipal String userIdStr) {
        try{
            Long id;
            try {
                id = Long.parseLong(userIdStr);
            } catch (NumberFormatException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "Invalid user ID", null));
            }
            userService.changePassword(id, changePasswordRequest);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Change password success", null));
        } catch (AppException e) {
            log.error("Error changing password", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getErrorCode().getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error changing password", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }

    /**
     * Xác minh OTP
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(@Validated @RequestBody VerifyOTPRequest verifyOtpRequest) {
        try {
            userService.verifyOTP(verifyOtpRequest);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "OTP verified successfully", null));
        } catch (AppException e) {
            log.error("Error verifying OTP", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getErrorCode().getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error verifying OTP", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }

    /**
     * Quên mật khẩu - Gửi email chứa OTP
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Validated @RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        try {
            userService.forgotPassword(forgotPasswordRequest.getEmail());
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Forgot password email sent successfully", null));
        } catch (AppException e) {
            log.error("Error in forgot password", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getErrorCode().getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error in forgot password", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }

    /**
     * Đặt lại mật khẩu sử dụng OTP
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Validated @RequestBody ResetPasswordRequest resetPasswordRequest) {
        try {
            userService.resetPassword(resetPasswordRequest.getEmail(),
                    resetPasswordRequest.getOtp(),
                    resetPasswordRequest.getNewPassword());
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Reset password success", null));
        } catch (AppException e) {
            log.error("Error in reset password", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getErrorCode().getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error in reset password", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", null));
        }
    }
}
