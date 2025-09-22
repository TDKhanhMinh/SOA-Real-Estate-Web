package com.example.SecurityService.dto.request;

import com.example.SecurityService.entity.User;
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
public class UserRequest {
    @Size(min = 3, message = "USER_NAME_INVALID")
    private String userName;
    @Email(message = "EMAIL_INVALID")
    @Size(max = 100, message = "EMAIL_TOO_LONG")
    private String email;
    @Size(min = 8, max = 20, message = "PASSWORD_INVALID")
    private String password;
    private String role;
}
