package com.example.UserService.response;

import com.example.UserService.dto.UserDTO;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private UserDTO user;

    public AuthResponse(String jwtToken, UserDTO user) {
        this.token = jwtToken;
        this.user = user;
    }
}