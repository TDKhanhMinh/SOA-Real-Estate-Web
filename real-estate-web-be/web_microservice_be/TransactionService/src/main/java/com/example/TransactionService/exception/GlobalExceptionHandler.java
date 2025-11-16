package com.example.TransactionService.exception;

import com.example.TransactionService.response.ApiResponse;
import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

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

    @ExceptionHandler(PropertyReferenceException.class)
    public ResponseEntity<ApiResponse<?>> handleValidationException(PropertyReferenceException e) {
        ApiResponse<?> response = ApiResponse.builder()
                .statusCode(ErrorCode.INVALID_KEY.getCode())
                .message("Invalid sort key: " + e.getPropertyName())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Object>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String name = ex.getName(); // Tên tham số (vd: "status")
        String requiredType = ex.getRequiredType().getSimpleName(); // Kiểu dữ liệu (vd: "Status")
        Object value = ex.getValue(); // Giá trị sai (vd: "INVALID_STATUS")

        String message = String.format("Tham số '%s' không hợp lệ. Giá trị '%s' không thể chuyển thành '%s'.",
                name, value, requiredType);

        ApiResponse<Object> apiResponse = new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), message, null);

        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<ApiResponse<?>> buildErrorResponse(ErrorCode errorCode, HttpStatus status) {
        ApiResponse<?> response = ApiResponse.builder()
                .statusCode(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        return ResponseEntity.status(status).body(response);
    }


}
