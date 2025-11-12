package com.example.SubscriptionService.request;

// Thêm các import cho validation
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record UpdateSubscriptionRequest(
        @Size(max = 100, message = "Tên gói không được vượt quá 100 ký tự")
        String name,

        @PositiveOrZero(message = "Giá phải là 0 hoặc số dương")
        Double price,

        @Positive(message = "Thời hạn (số ngày) phải là số dương")
        Integer duration,

        @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
        String description, // Giả sử mô tả có thể trống

        @Min(value = 1, message = "Số lượng bài đăng tối đa phải ít nhất là 1")
        Integer maxPost,

        @Positive(message = "Độ ưu tiên phải là số dương")
        Integer priority,

        @Positive(message = "Số ngày hết hạn bài đăng phải là số dương")
        Integer postExpiryDays,

        Boolean isActive
) {
}