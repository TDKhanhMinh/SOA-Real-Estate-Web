package com.example.SubscriptionService.dto;
import jakarta.validation.constraints.*;
import lombok.Builder;

@Builder
public record SubscriptionDTO (
        @NotBlank(message = "Tên gói không được để trống")
        @Size(max = 100, message = "Tên gói không được vượt quá 100 ký tự")
        String name,

        @NotNull(message = "Giá không được để trống")
        @PositiveOrZero(message = "Giá phải là số dương hoặc bằng 0")
        Double price,

        @NotNull(message = "Thời hạn không được để trống")
        @Positive(message = "Thời hạn (số ngày) phải là số dương")
        Integer duration,

        @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
        String description, // Giả sử mô tả có thể trống

        @NotNull(message = "Số lượng bài đăng tối đa không được để trống")
        @Min(value = 1, message = "Số lượng bài đăng tối đa phải ít nhất là 1")
        Integer maxPost,

        @NotNull(message = "Độ ưu tiên không được để trống")
        @Positive(message = "Độ ưu tiên phải là số dương")
        Integer priority,

        @NotNull(message = "Số ngày hết hạn bài đăng không được để trống")
        @Positive(message = "Số ngày hết hạn bài đăng phải là số dương")
        Integer postExpiryDays
) { }
