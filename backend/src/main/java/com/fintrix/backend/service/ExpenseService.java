package com.fintrix.backend.service;

import com.fintrix.backend.dto.ExpenseRequest;
import com.fintrix.backend.dto.ExpenseResponse;
import com.fintrix.backend.exception.ResourceNotFoundException;
import com.fintrix.backend.exception.UnauthorizedAccessException;
import com.fintrix.backend.entity.Expense;
import com.fintrix.backend.entity.User;
import com.fintrix.backend.entity.Workspace;
import com.fintrix.backend.enums.Role;
import com.fintrix.backend.repository.ExpenseRepository;
import com.fintrix.backend.repository.MembershipRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserService userService;
    private final WorkspaceService workspaceService;
    private final MembershipRepository membershipRepository;

    @Transactional
    public ExpenseResponse createExpense(Authentication authentication, ExpenseRequest request) {
        User currentUser = userService.getCurrentUser(authentication);

        // Backwards compatibility: legacy endpoints don't pass a workspaceId.
        // Use the user's most recent membership as the default workspace.
        Workspace defaultWorkspace = membershipRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId())
                .stream()
                .findFirst()
                .map(m -> m.getWorkspace())
                .orElseThrow(() -> new ResourceNotFoundException("User has no workspace"));

        Expense savedExpense = expenseRepository.save(Expense.builder()
                .title(request.title().trim())
                .amount(request.amount())
                .category(request.category().trim())
                .date(request.date())
                .user(currentUser)
                .workspace(defaultWorkspace)
                .build());
        return toResponse(savedExpense);
    }

    // --- Workspace-scoped (multi-tenant) methods ---

    @Transactional
    public ExpenseResponse createExpense(Authentication authentication, Long workspaceId, ExpenseRequest request) {
        User currentUser = userService.getCurrentUser(authentication);
        Workspace workspace = workspaceService.getWorkspace(workspaceId);

        Expense savedExpense = expenseRepository.save(Expense.builder()
                .title(request.title().trim())
                .amount(request.amount())
                .category(request.category().trim())
                .date(request.date())
                .user(currentUser)
                .workspace(workspace)
                .build());

        return toResponse(savedExpense);
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getWorkspaceExpenses(Long workspaceId) {
        // validate workspace exists
        workspaceService.getWorkspace(workspaceId);
        return expenseRepository.findByWorkspaceIdOrderByDateDescCreatedAtDesc(workspaceId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getWorkspaceExpenseById(Long workspaceId, Long expenseId) {
        Expense expense = findWorkspaceExpense(workspaceId, expenseId);
        return toResponse(expense);
    }

    @Transactional
    public ExpenseResponse updateWorkspaceExpense(Authentication authentication,
                                                 Long workspaceId,
                                                 Long expenseId,
                                                 ExpenseRequest request,
                                                 Role membershipRole) {
        User currentUser = userService.getCurrentUser(authentication);
        Expense expense = findWorkspaceExpense(workspaceId, expenseId);

        // Balanced permission model:
        // - ADMIN can edit any record
        // - ANALYST can edit only records they created
        if (membershipRole == Role.ANALYST && !expense.getUser().getId().equals(currentUser.getId())) {
            // analysts can't modify other members' data
            throw new UnauthorizedAccessException("Analysts can only edit their own records");
        }

        expense.setTitle(request.title().trim());
        expense.setAmount(request.amount());
        expense.setCategory(request.category().trim());
        expense.setDate(request.date());
        return toResponse(expenseRepository.save(expense));
    }

    /**
     * Helper for controllers that need the current user's id.
     */
    public Long getCurrentUserId(Authentication authentication) {
        return userService.getCurrentUser(authentication).getId();
    }

    @Transactional
    public void deleteWorkspaceExpense(Long workspaceId, Long expenseId) {
        Expense expense = findWorkspaceExpense(workspaceId, expenseId);
        expenseRepository.delete(expense);
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getMyExpenses(Authentication authentication) {
        User currentUser = userService.getCurrentUser(authentication);
        return expenseRepository.findByUserIdOrderByDateDescCreatedAtDesc(currentUser.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getMyExpenseById(Authentication authentication, Long expenseId) {
        User currentUser = userService.getCurrentUser(authentication);
        Expense expense = findOwnedExpense(expenseId, currentUser.getId());
        return toResponse(expense);
    }

    @Transactional
    public ExpenseResponse updateExpense(Authentication authentication, Long expenseId, ExpenseRequest request) {
        User currentUser = userService.getCurrentUser(authentication);
        Expense expense = findOwnedExpense(expenseId, currentUser.getId());
        expense.setTitle(request.title().trim());
        expense.setAmount(request.amount());
        expense.setCategory(request.category().trim());
        expense.setDate(request.date());
        return toResponse(expenseRepository.save(expense));
    }

    @Transactional
    public void deleteExpense(Authentication authentication, Long expenseId) {
        User currentUser = userService.getCurrentUser(authentication);
        Expense expense = findOwnedExpense(expenseId, currentUser.getId());
        expenseRepository.delete(expense);
    }

    public ExpenseResponse toResponse(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getTitle(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getDate(),
                expense.getUser().getId(),
                expense.getCreatedAt());
    }

    private Expense findOwnedExpense(Long expenseId, Long userId) {
        // tenant boundary for "my" endpoints
        return expenseRepository.findByIdAndUserId(expenseId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + expenseId));
    }

    private Expense findWorkspaceExpense(Long workspaceId, Long expenseId) {
        // tenant boundary for workspace-scoped endpoints
        return expenseRepository.findByIdAndWorkspaceId(expenseId, workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + expenseId));
    }
}
