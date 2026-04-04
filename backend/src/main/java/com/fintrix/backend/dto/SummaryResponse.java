package com.fintrix.backend.dto;

import java.math.BigDecimal;

/**
 * Small summary DTO for dashboard totals.
 */
public record SummaryResponse(
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        BigDecimal net
) {
}

