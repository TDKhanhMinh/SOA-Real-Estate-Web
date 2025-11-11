package com.example.UserService.service;

import com.example.UserService.dto.UserDTO;
import com.example.UserService.request.ChangePasswordRequest;
import com.example.UserService.request.UpdateProfileRequest;
import com.example.UserService.request.UpdateRequest;
import com.example.UserService.response.PageResponse;
import com.example.UserService.response.UserResponse;
import com.example.UserService.model.User;
import com.example.UserService.response.AuthResponse;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;

@Service
public interface UserService {
    PageResponse<UserResponse> getAllUsers(Pageable pageable);

    UserResponse getUserById(Long id);

    UserDTO getUserProfile(Long id);

    UserResponse updateUser(UpdateRequest updateRequest, Long id);

    UserDTO updateProfile(UpdateProfileRequest updateProfileRequest, Long id);

    AuthResponse verify(User user);

    UserDTO register(User user);

    PageResponse<UserResponse> searchUsers(String keyword, Pageable pageable);

    void changePassword(Long id, ChangePasswordRequest changePasswordRequest);

    void forgotPassword(String email);

    void resetPassword(String email, String otpCode, String newPassword);
}
