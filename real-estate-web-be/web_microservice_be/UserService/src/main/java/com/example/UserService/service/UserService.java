package com.example.UserService.service;

import com.example.UserService.dto.UserDTO;
import com.example.UserService.request.UserUpdate;
import com.example.UserService.response.UserResponse;
import com.example.UserService.model.User;
import com.example.UserService.response.AuthResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    void deleteById(Long id);

    UserDTO register(User user);

    UserResponse updateUser(UserUpdate userUpdate, Long id);

    AuthResponse verify(User user);
}
