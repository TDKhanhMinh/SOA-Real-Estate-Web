package com.example.TransactionService.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record TopUpRequest (
        @NotNull(message = "AMOUNT_REQUIRED")
        @PositiveOrZero(message = "AMOUNT_INVALID")
        Double amount,

        @Email(message = "EMAIL_INVALID")
        @Size(max = 100, message = "EMAIL_TOO_LONG")
        String email,

        @Size(min = 3, message = "NAME_INVALID")
        String userName,

        @NotNull(message = "PAYMENT_METHOD_REQUIRED")
        String paymentMethod
) { }
