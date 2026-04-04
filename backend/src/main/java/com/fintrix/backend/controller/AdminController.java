package com.fintrix.backend.controller;

import com.fintrix.backend.dto.ExpenseResponse;
import com.fintrix.backend.dto.TransactionResponse;
import com.fintrix.backend.dto.UserResponse;
import com.fintrix.backend.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Administrative monitoring endpoints")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    @Operation(summary = "Get all users")
    @PreAuthorize("denyAll()")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        throw new UnsupportedOperationException("Global admin endpoints are disabled. Use workspace member APIs.");
    }

    @GetMapping("/expenses")
    @Operation(summary = "Get all expenses")
    @PreAuthorize("denyAll()")
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses() {
        throw new UnsupportedOperationException("Global admin endpoints are disabled. Use workspace expense APIs.");
    }

    @GetMapping("/transactions")
    @Operation(summary = "Get all borrow and lend transactions")
    @PreAuthorize("denyAll()")
    public ResponseEntity<List<TransactionResponse>> getAllTransactions() {
        throw new UnsupportedOperationException("Global admin endpoints are disabled. Use workspace transaction APIs.");
    }
}
