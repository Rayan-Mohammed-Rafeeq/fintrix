package com.fintrix.backend.controller;

import com.fintrix.backend.dto.TransactionRequest;
import com.fintrix.backend.dto.TransactionResponse;
import com.fintrix.backend.service.BorrowTransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Borrow and lend transaction APIs")
@SecurityRequirement(name = "bearerAuth")
public class TransactionController {

    private final BorrowTransactionService transactionService;

    @PostMapping("/borrow")
    @Operation(summary = "Create a borrow request from another user")
    @PreAuthorize("denyAll()")
    public ResponseEntity<TransactionResponse> createBorrow(Authentication authentication,
                                                            @Valid @RequestBody TransactionRequest request) {
        throw new UnsupportedOperationException("Use /api/v1/workspaces/{workspaceId}/transactions/borrow");
    }

    @PostMapping("/lend")
    @Operation(summary = "Create a lending transaction for another user")
    @PreAuthorize("denyAll()")
    public ResponseEntity<TransactionResponse> createLend(Authentication authentication,
                                                          @Valid @RequestBody TransactionRequest request) {
        throw new UnsupportedOperationException("Use /api/v1/workspaces/{workspaceId}/transactions/lend");
    }

    @GetMapping
    @Operation(summary = "Get all transactions involving the logged in user")
    @PreAuthorize("denyAll()")
    public ResponseEntity<List<TransactionResponse>> getTransactions(Authentication authentication) {
        throw new UnsupportedOperationException("Use /api/v1/workspaces/{workspaceId}/transactions");
    }

    @PutMapping("/{id}/pay")
    @Operation(summary = "Mark a transaction as paid")
    @PreAuthorize("denyAll()")
    public ResponseEntity<TransactionResponse> markAsPaid(Authentication authentication, @PathVariable Long id) {
        throw new UnsupportedOperationException("Use /api/v1/workspaces/{workspaceId}/transactions/{id}/pay");
    }
}

