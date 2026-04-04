// Spring Boot REST controller for Fintrix expense CRUD APIs with JWT authentication
package com.fintrix.backend.controller;

import com.fintrix.backend.dto.ExpenseRequest;
import com.fintrix.backend.dto.ExpenseResponse;
import com.fintrix.backend.service.ExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
@Tag(name = "Expenses", description = "Expense management APIs")
@SecurityRequirement(name = "bearerAuth")
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    @Operation(summary = "Create an expense for the logged in user")
    @PreAuthorize("denyAll()")
    public ResponseEntity<ExpenseResponse> createExpense(Authentication authentication,
                                                         @Valid @RequestBody ExpenseRequest request) {
        throw new UnsupportedOperationException("Use /api/v1/workspaces/{workspaceId}/expenses");
    }

    @GetMapping
    @Operation(summary = "Get all expenses for the logged in user")
    @PreAuthorize("denyAll()")
    public ResponseEntity<List<ExpenseResponse>> getMyExpenses(Authentication authentication) {
        throw new UnsupportedOperationException("Use /api/v1/workspaces/{workspaceId}/expenses");
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single expense owned by the logged in user")
    @PreAuthorize("denyAll()")
    public ResponseEntity<ExpenseResponse> getExpense(Authentication authentication, @PathVariable Long id) {
        throw new UnsupportedOperationException("Use /api/v1/workspaces/{workspaceId}/expenses/{id}");
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an expense owned by the logged in user")
    @PreAuthorize("denyAll()")
    public ResponseEntity<ExpenseResponse> updateExpense(Authentication authentication,
                                                         @PathVariable Long id,
                                                         @Valid @RequestBody ExpenseRequest request) {
        throw new UnsupportedOperationException("Use /api/v1/workspaces/{workspaceId}/expenses/{id}");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an expense owned by the logged in user")
    @PreAuthorize("denyAll()")
    public ResponseEntity<Void> deleteExpense(Authentication authentication, @PathVariable Long id) {
        throw new UnsupportedOperationException("Use /api/v1/workspaces/{workspaceId}/expenses/{id}");
    }
}
