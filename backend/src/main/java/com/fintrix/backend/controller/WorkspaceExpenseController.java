package com.fintrix.backend.controller;

import com.fintrix.backend.dto.ExpenseRequest;
import com.fintrix.backend.dto.ExpenseResponse;
import com.fintrix.backend.enums.Role;
import com.fintrix.backend.service.ExpenseService;
import com.fintrix.backend.service.MembershipService;
import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("/api/v1/workspaces/{workspaceId}/expenses")
@RequiredArgsConstructor
public class WorkspaceExpenseController {

    private final ExpenseService expenseService;
    private final MembershipService membershipService;

    @PostMapping
    @Operation(summary = "Create an expense inside a workspace")
    @PreAuthorize("@workspaceAuth.hasAnyRole(authentication, #workspaceId, 'ANALYST','ADMIN')")
    public ResponseEntity<ExpenseResponse> create(Authentication authentication,
                                                 @PathVariable Long workspaceId,
                                                 @Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.createExpense(authentication, workspaceId, request));
    }

    @GetMapping
    @Operation(summary = "List expenses for a workspace")
    @PreAuthorize("@workspaceAuth.hasAnyRole(authentication, #workspaceId, 'VIEWER','ANALYST','ADMIN')")
    public ResponseEntity<List<ExpenseResponse>> list(@PathVariable Long workspaceId) {
        return ResponseEntity.ok(expenseService.getWorkspaceExpenses(workspaceId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single expense inside a workspace")
    @PreAuthorize("@workspaceAuth.hasAnyRole(authentication, #workspaceId, 'VIEWER','ANALYST','ADMIN')")
    public ResponseEntity<ExpenseResponse> getOne(@PathVariable Long workspaceId, @PathVariable Long id) {
        return ResponseEntity.ok(expenseService.getWorkspaceExpenseById(workspaceId, id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an expense inside a workspace")
    @PreAuthorize("@workspaceAuth.hasAnyRole(authentication, #workspaceId, 'ANALYST','ADMIN')")
    public ResponseEntity<ExpenseResponse> update(Authentication authentication,
                                                 @PathVariable Long workspaceId,
                                                 @PathVariable Long id,
                                                 @Valid @RequestBody ExpenseRequest request) {
        Role role = membershipService.getRoleOrThrow(workspaceId, expenseService.getCurrentUserId(authentication));
        return ResponseEntity.ok(expenseService.updateWorkspaceExpense(authentication, workspaceId, id, request, role));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an expense inside a workspace")
    @PreAuthorize("@workspaceAuth.isAdmin(authentication, #workspaceId)")
    public ResponseEntity<Void> delete(@PathVariable Long workspaceId, @PathVariable Long id) {
        expenseService.deleteWorkspaceExpense(workspaceId, id);
        return ResponseEntity.noContent().build();
    }
}

