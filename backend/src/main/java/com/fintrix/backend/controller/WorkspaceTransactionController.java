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
@RequestMapping("/api/v1/workspaces/{workspaceId}/transactions")
@RequiredArgsConstructor
@Tag(name = "Workspace Transactions", description = "Workspace-scoped borrow and lend transaction APIs")
@SecurityRequirement(name = "bearerAuth")
public class WorkspaceTransactionController {

    private final BorrowTransactionService transactionService;

    @PostMapping("/borrow")
    @Operation(summary = "Create a borrow request within a workspace")
    @PreAuthorize("@workspaceAuth.hasAnyRole(authentication, #workspaceId, 'ANALYST','ADMIN')")
    public ResponseEntity<TransactionResponse> createBorrow(Authentication authentication,
                                                            @PathVariable Long workspaceId,
                                                            @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(transactionService.createBorrow(authentication, workspaceId, request));
    }

    @PostMapping("/lend")
    @Operation(summary = "Create a lend request within a workspace")
    @PreAuthorize("@workspaceAuth.hasAnyRole(authentication, #workspaceId, 'ANALYST','ADMIN')")
    public ResponseEntity<TransactionResponse> createLend(Authentication authentication,
                                                          @PathVariable Long workspaceId,
                                                          @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(transactionService.createLend(authentication, workspaceId, request));
    }

    @GetMapping
    @Operation(summary = "Get all transactions involving the logged in user within a workspace")
    @PreAuthorize("@workspaceAuth.hasAnyRole(authentication, #workspaceId, 'VIEWER','ANALYST','ADMIN')")
    public ResponseEntity<List<TransactionResponse>> getTransactions(Authentication authentication,
                                                                    @PathVariable Long workspaceId) {
        return ResponseEntity.ok(transactionService.getWorkspaceTransactions(authentication, workspaceId));
    }

    @PutMapping("/{id}/pay")
    @Operation(summary = "Mark a workspace transaction as paid")
    @PreAuthorize("@workspaceAuth.hasAnyRole(authentication, #workspaceId, 'VIEWER','ANALYST','ADMIN')")
    public ResponseEntity<TransactionResponse> markAsPaid(Authentication authentication,
                                                          @PathVariable Long workspaceId,
                                                          @PathVariable Long id) {
        return ResponseEntity.ok(transactionService.markAsPaid(authentication, workspaceId, id));
    }
}

