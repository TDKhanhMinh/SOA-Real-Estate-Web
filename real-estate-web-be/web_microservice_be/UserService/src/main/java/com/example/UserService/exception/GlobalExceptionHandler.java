package com.example.UserService.exception;

import com.example.UserService.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Objects;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse<?>> handleRuntimeException(Exception e) {
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setStatusCode(ErrorCode.UNCATEGORIZED_ERROR.getCode());
        apiResponse.setMessage(e.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }


    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<?>> handleAppException(AppException e) {
        return buildErrorResponse(e.getErrorCode(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleValidationException(MethodArgumentNotValidException e) {
        String enumKey = Objects.requireNonNull(e.getFieldError()).getDefaultMessage();

        ErrorCode errorCode = ErrorCode.INVALID_KEY;
        try {
            errorCode = ErrorCode.valueOf(enumKey);
        } catch (IllegalArgumentException ignored) {}

        return buildErrorResponse(errorCode, HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<ApiResponse<?>> buildErrorResponse(ErrorCode errorCode, HttpStatus status) {
        ApiResponse<?> response = ApiResponse.builder()
                .statusCode(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        return ResponseEntity.status(status).body(response);
    }
}
