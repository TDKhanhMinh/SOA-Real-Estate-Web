package com.example.UserService.mapper;

import com.example.UserService.request.*;
import com.example.UserService.response.*;
import com.example.UserService.model.User;
import com.example.UserService.dto.UserDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // Entity -> Response
    default UserResponse toUserResponse(User user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .isActive(user.getIsActive())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .createdAt(user.getCreatedAt())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .build();
    }

    default UserDTO toUserDTO(User user) {
        if (user == null) return null;
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .createdAt(user.getCreatedAt())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

    default User.Role mapRole(String role) {
        return role != null ? User.Role.valueOf(role.toUpperCase()) : null;
    }
}




