package com.example.SecurityService.controller;

import com.example.SecurityService.dto.request.UserRequest;
import com.example.SecurityService.dto.request.UserUpdate;

import com.example.SecurityService.dto.restponse.ApiResponse;
import com.example.SecurityService.dto.restponse.UserResponse;
import com.example.SecurityService.entity.User;
import com.example.SecurityService.serviceimplement.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class UserController {
    @Autowired
    private UserServiceImpl userService;

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable("id") int id) {
        return userService.getUserById(id);
    }

    @PostMapping("/create")
    public ApiResponse<User> createUser(@Validated @RequestBody UserRequest userRequest) {
        ApiResponse<User> response = new ApiResponse<>();
        response.setStatusCode(500);
        response.setMessage("Success to create user");
        response.setData(userService.createUser(userRequest));
        return response;
    }

    @PutMapping("/update/{id}")
    public UserResponse updateUser(@RequestBody UserUpdate userUpdate, @PathVariable("id") int id) {
        return userService.updateUser(userUpdate, id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable int id) {
        User user = userService.getUserById(id);
        if (user == null) {
            throw new RuntimeException("User not found to delete");
        }
        userService.deleteById(id);
    }
}
