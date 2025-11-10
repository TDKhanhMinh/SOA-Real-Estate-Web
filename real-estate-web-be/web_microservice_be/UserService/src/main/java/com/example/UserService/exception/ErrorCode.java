package com.example.UserService.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public enum ErrorCode {
    USER_NAME_INVALID(1, "User name must be more than 5 characters "),
    EMAIL_EXIST(4, "Email already exists"),
    PASSWORD_INVALID(2, "Password must be more than 8 characters"),
    INVALID_KEY(3, "Invalid message key"),
    UNCATEGORIZED_ERROR(999, "An unexpected error occurred"),
    USER_EXIST(1001, "User already exists"),
    ADMIN_ALREADY_EXISTS(1003, "Admin already exists"),
    PASSWORD_NOT_MATCH(1003, "Password not match"),
    USER_NOT_FOUND(1002, "User not found");
    private final int code;
    private final String message;


}
