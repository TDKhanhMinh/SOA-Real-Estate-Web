package com.example.SecurityService.service;

import com.example.SecurityService.dto.request.UserRequest;
import com.example.SecurityService.dto.request.UserUpdate;
import com.example.SecurityService.dto.restponse.UserResponse;
import com.example.SecurityService.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    List<User> getAllUsers();

    User getUserById(int id);



    void deleteById(int id);

    User createUser(UserRequest userRequest);

    UserResponse updateUser(UserUpdate userUpdate, int id);
}
