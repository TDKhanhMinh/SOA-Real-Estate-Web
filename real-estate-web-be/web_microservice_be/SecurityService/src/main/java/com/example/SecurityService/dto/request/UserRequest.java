package com.example.SecurityService.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class UserRequest {
    @Size(min = 3, message = "USER_NAME_INVALID")
    private String userName;
    @Size(min = 5, max = 100, message = "EMAIL_EXIST")
    private String email;
    @Size(min = 8, max = 20, message = "PASSWORD_INVALID")
    private String password;
    @Size(min = 8, max = 20, message = "PASSWORD_INVALID")
    private String passwordConfirmation;
}
