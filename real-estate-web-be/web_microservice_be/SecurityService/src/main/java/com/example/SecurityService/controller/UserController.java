package com.example.SecurityService.controller;

import com.example.SecurityService.config.JwtUtil;
import com.example.SecurityService.dto.request.LoginRequest;
import com.example.SecurityService.dto.request.UserRequest;
import com.example.SecurityService.dto.request.UserUpdate;
import com.example.SecurityService.dto.restponse.ApiResponse;
import com.example.SecurityService.dto.restponse.UserResponse;
import com.example.SecurityService.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class UserController {
    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;
    public UserController(UserService userService, JwtUtil jwtUtil, AuthenticationManager authManager) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.authManager = authManager;
    }
    @GetMapping("/test/hello")
    public String hello() {
        return "Hello, secured world!";
    }

    @GetMapping("/all")
    public ApiResponse<List<UserResponse>> getAllUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .statusCode(200)
                .message("Success")
                .data(userService.getAllUsers())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getById(@PathVariable int id) {
        return ApiResponse.<UserResponse>builder()
                .statusCode(200)
                .message("Success")
                .data(userService.getUserById(id))
                .build();
    }

    @PostMapping("/create")
    public ApiResponse<UserResponse> createUser(@Validated @RequestBody UserRequest userRequest) {
        return ApiResponse.<UserResponse>builder()
                .statusCode(201)
                .message("User created successfully")
                .data(userService.createUser(userRequest))
                .build();
    }

    @PutMapping("/update/{id}")
    public ApiResponse<UserResponse> updateUser(@RequestBody UserUpdate userUpdate, @PathVariable int id) {
        return ApiResponse.<UserResponse>builder()
                .statusCode(200)
                .message("User updated successfully")
                .data(userService.updateUser(userUpdate, id))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable int id) {
        userService.deleteById(id);
        return ApiResponse.<Void>builder()
                .statusCode(200)
                .message("User deleted successfully")
                .build();
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        log.warn("Data sending from FE" + request);
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        return jwtUtil.generateToken(authentication.getName());
    }

}
