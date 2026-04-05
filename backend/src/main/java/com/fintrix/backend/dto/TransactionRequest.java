package com.fintrix.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionRequest(
        @NotBlank(message = "Counterparty email is required")
        @Email(message = "Counterparty email must be a valid email")
        String counterpartyEmail,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
        BigDecimal amount,

        @NotBlank(message = "Description is required")
        @Size(max = 255, message = "Description must not exceed 255 characters")
        String description,

        /**
         * Optional user-supplied date for the transaction (e.g., when the lend/borrow happened).
         * If omitted, we default it to the server's current date.
         */
        LocalDate transactionDate
) {
}

