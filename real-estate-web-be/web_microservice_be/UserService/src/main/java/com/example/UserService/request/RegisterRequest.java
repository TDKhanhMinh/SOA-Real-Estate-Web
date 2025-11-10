package com.example.UserService.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @Size(min = 3, message = "NAME_INVALID")
    private String name;
    @Email(message = "EMAIL_INVALID")
    @Size(max = 100, message = "EMAIL_TOO_LONG")
    private String email;
    @Size(min = 8, max = 20, message = "PASSWORD_INVALID")
    private String password;
    @Size(min = 10, max = 10, message = "PHONE_INVALID")
    private String phone;
}
