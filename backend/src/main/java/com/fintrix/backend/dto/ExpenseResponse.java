package com.fintrix.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ExpenseResponse(
        Long id,
        String title,
        BigDecimal amount,
        String category,
        LocalDate date,
        Long userId,
        LocalDateTime createdAt
) {
}
