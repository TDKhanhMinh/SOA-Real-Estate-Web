package com.example.UserService.controller;

import com.example.UserService.exception.AppException;
import com.example.UserService.request.LoginRequest;
import com.example.UserService.request.RegisterRequest;
import com.example.UserService.request.UserUpdate;
import com.example.UserService.response.ApiResponse;
import com.example.UserService.response.UserResponse;
import com.example.UserService.model.User;
import com.example.UserService.service.UserService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.example.UserService.dto.UserDTO;

import java.util.List;

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

    @GetMapping("/all")
    public ApiResponse<List<UserResponse>> getAllUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .statusCode(200)
                .message("Success")
                .data(userService.getAllUsers())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getById(@PathVariable Long id) {
        return ApiResponse.<UserResponse>builder()
                .statusCode(200)
                .message("Success")
                .data(userService.getUserById(id))
                .build();
    }

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
        }catch (AppException e){
            log.error("Error during registration", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null));
        }
    }

    @PutMapping("/update/{id}")
    public ApiResponse<UserResponse> updateUser(@RequestBody UserUpdate userUpdate, @PathVariable Long id) {
        return ApiResponse.<UserResponse>builder()
                .statusCode(200)
                .message("User updated successfully")
                .data(userService.updateUser(userUpdate, id))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return ApiResponse.<Void>builder()
                .statusCode(200)
                .message("User deleted successfully")
                .build();
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest request) {
        try {
            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());

            return ResponseEntity.ok(new ApiResponse(HttpStatus.OK.value(), "Login successful", userService.verify(user)));
        } catch (Exception e) {
            log.error("Error during login", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(HttpStatus.BAD_REQUEST.value(), "Invalid email or password", null));
        }
    }
}
