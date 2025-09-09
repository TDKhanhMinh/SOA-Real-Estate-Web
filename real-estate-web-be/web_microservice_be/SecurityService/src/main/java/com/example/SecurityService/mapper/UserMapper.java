package com.example.SecurityService.mapper;


import com.example.SecurityService.dto.request.UserRequest;
import com.example.SecurityService.dto.request.UserUpdate;
import com.example.SecurityService.dto.restponse.UserResponse;
import com.example.SecurityService.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;


@Component
@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toUserResponse(User user);
    User toUser(UserRequest userRequest);
    void updateUser(@MappingTarget User user, UserUpdate userUpdate);
}
