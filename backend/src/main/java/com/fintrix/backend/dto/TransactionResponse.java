package com.fintrix.backend.dto;

import com.fintrix.backend.entity.TransactionStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
        Long id,
        BigDecimal amount,
        Long borrowerId,
        String borrowerName,
        Long lenderId,
        String lenderName,
        String description,
        TransactionStatus status,
        LocalDateTime createdAt
) {
}

