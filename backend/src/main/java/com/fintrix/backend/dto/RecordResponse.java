package com.fintrix.backend.dto;

import com.fintrix.backend.enums.RecordStatus;
import com.fintrix.backend.enums.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Response DTO for returning a financial record.
 */
public record RecordResponse(
        Long id,
        BigDecimal amount,
        TransactionType type,
        String category,
        LocalDate date,
        String description,
        Long userId,
        RecordStatus status,
        LocalDateTime createdAt
) {
}

