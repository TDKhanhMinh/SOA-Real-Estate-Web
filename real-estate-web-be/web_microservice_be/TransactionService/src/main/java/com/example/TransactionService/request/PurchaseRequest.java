package com.example.TransactionService.request;

import jakarta.validation.constraints.*;

public record PurchaseRequest (
    @NotNull(message = "SUBSCRIPTION_ORDER_ID_REQUIRED")
    Long subscriptionOrderId,

    @Email(message = "EMAIL_INVALID")
    @Size(max = 100, message = "EMAIL_TOO_LONG")
    String email,

    @Size(min = 3, message = "NAME_INVALID")
    String userName,

    @NotNull(message = "SUBSCRIPTION_ID_REQUIRED")
    Long subscriptionId,

    @NotNull(message = "SUBSCRIPTION_NAME_REQUIRED")
    String subscriptionName,

    @NotNull(message = "AMOUNT_REQUIRED")
    @PositiveOrZero(message = "AMOUNT_INVALID")
    Double amount
) { }
