package com.example.UserService.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResetPasswordRequest {
    @Email(message = "EMAIL_INVALID")
    @Size(max = 100, message = "EMAIL_TOO_LONG")
    private String email;
    @Size(min = 6, max = 6, message = "OTP_INVALID")
    private String otp;
    @Size(min = 8, max = 20, message = "PASSWORD_INVALID")
    private String newPassword;
}
