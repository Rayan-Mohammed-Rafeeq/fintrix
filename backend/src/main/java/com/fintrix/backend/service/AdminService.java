package com.fintrix.backend.service;

import com.fintrix.backend.dto.ExpenseResponse;
import com.fintrix.backend.dto.TransactionResponse;
import com.fintrix.backend.dto.UserResponse;
import com.fintrix.backend.repository.BorrowTransactionRepository;
import com.fintrix.backend.repository.ExpenseRepository;
import com.fintrix.backend.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;
    private final BorrowTransactionRepository transactionRepository;
    private final UserService userService;
    private final ExpenseService expenseService;
    private final BorrowTransactionService borrowTransactionService;

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(userService::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getAllExpenses() {
        return expenseRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(expenseService::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getAllTransactions() {
        return transactionRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(borrowTransactionService::toResponse)
                .toList();
    }
}

