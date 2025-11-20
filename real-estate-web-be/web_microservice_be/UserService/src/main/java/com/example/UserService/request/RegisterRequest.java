package com.example.UserService.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @Size(min = 3, message = "NAME_INVALID")
    @NotNull(message = "NAME_REQUIRED")
    private String name;
    @Email(message = "EMAIL_INVALID")
    @Size(max = 100, message = "EMAIL_TOO_LONG")
    @NotNull(message = "EMAIL_REQUIRED")
    private String email;
    @Size(min = 8, max = 20, message = "PASSWORD_INVALID")
    @NotNull(message = "PASSWORD_REQUIRED")
    private String password;
    @Size(min = 10, max = 10, message = "PHONE_INVALID")
    @NotNull(message = "PHONE_REQUIRED")
    @Pattern(regexp = "^(\\+84|0)(3|5|7|8|9)[0-9]{8}$", message = "Số điện thoại không hợp lệ")
    private String phone;
}
