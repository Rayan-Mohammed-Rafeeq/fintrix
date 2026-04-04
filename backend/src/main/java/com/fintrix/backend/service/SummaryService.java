package com.fintrix.backend.service;

import com.fintrix.backend.dto.SummaryResponse;
import com.fintrix.backend.entity.User;
import com.fintrix.backend.enums.TransactionType;
import com.fintrix.backend.repository.TransactionRepository;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SummaryService {

    private final TransactionRepository transactionRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public SummaryResponse getSummary(Authentication authentication) {
        User user = userService.getCurrentUser(authentication);

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;

        for (var tx : transactionRepository.findByUserIdOrderByDateDescCreatedAtDesc(user.getId())) {
            if (tx.getType() == TransactionType.INCOME) {
                totalIncome = totalIncome.add(tx.getAmount());
            } else if (tx.getType() == TransactionType.EXPENSE) {
                totalExpense = totalExpense.add(tx.getAmount());
            }
        }

        return new SummaryResponse(totalIncome, totalExpense, totalIncome.subtract(totalExpense));
    }
}

