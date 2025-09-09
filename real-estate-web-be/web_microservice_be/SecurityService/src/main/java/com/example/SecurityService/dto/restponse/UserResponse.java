package com.example.SecurityService.dto.restponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private int id;
    private String userName;
    private String email;
    private String password;
    private String passwordConfirmation;
}
