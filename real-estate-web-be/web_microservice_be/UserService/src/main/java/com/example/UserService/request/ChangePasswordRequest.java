package com.example.UserService.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequest {
    @Size(min = 8, max = 20, message = "PASSWORD_INVALID")
    private String oldPassword;
    @Size(min = 8, max = 20, message = "PASSWORD_INVALID")
    private String newPassword;
}
