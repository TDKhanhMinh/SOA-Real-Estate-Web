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
                .userName(user.getName())
                .email(user.getEmail())
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

//    // Request -> Entity
//    default User toUser(RegisterRequest req) {
//        User user = new User();
//        user.setName(req.getUserName());
//        user.setEmail(req.getEmail());
//        user.setPassword(req.getPassword());
//
//        if (req.getRole() != null) {
//            user.setRole(User.Role.valueOf(req.getRole().toUpperCase()));
//        } else {
//            user.setRole(User.Role.USER);
//        }
//
//        return user;
//    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUser(@MappingTarget User user, UserUpdate userUpdate);

    default User.Role mapRole(String role) {
        return role != null ? User.Role.valueOf(role.toUpperCase()) : null;
    }
}




