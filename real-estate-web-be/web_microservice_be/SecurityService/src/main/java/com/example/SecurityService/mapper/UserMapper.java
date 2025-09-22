package com.example.SecurityService.mapper;

import com.example.SecurityService.dto.request.UserRequest;
import com.example.SecurityService.dto.request.UserUpdate;
import com.example.SecurityService.dto.restponse.UserResponse;
import com.example.SecurityService.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // Entity -> Response
    default UserResponse toUserResponse(User user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .userName(user.getUserName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .build();
    }

    // Request -> Entity
    default User toUser(UserRequest req) {
        User user = new User();
        user.setUserName(req.getUserName());
        user.setEmail(req.getEmail());
        user.setPassword(req.getPassword());

        if (req.getRole() != null) {
            user.setRole(User.Role.valueOf(req.getRole().toUpperCase()));
        } else {
            user.setRole(User.Role.USER);
        }

        return user;
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUser(@MappingTarget User user, UserUpdate userUpdate);

    default User.Role mapRole(String role) {
        return role != null ? User.Role.valueOf(role.toUpperCase()) : null;
    }
}




