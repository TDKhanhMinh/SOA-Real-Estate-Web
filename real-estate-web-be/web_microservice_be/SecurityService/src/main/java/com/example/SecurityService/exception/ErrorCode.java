package com.example.SecurityService.exception;

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
    USER_EXIST(1001, "User already exists");


    private final int code;
    private final String message;


}
