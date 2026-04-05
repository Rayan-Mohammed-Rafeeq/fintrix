package com.fintrix.backend.service;

import com.fintrix.backend.dto.TransactionRequest;
import com.fintrix.backend.dto.TransactionResponse;
import com.fintrix.backend.exception.ResourceNotFoundException;
import com.fintrix.backend.exception.UnauthorizedAccessException;
import com.fintrix.backend.entity.BorrowTransaction;
import com.fintrix.backend.entity.TransactionStatus;
import com.fintrix.backend.entity.User;
import com.fintrix.backend.entity.Workspace;
import com.fintrix.backend.enums.Role;
import com.fintrix.backend.repository.BorrowTransactionRepository;
import java.util.List;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BorrowTransactionService {

    private final BorrowTransactionRepository transactionRepository;
    private final UserService userService;
    private final WorkspaceService workspaceService;
    private final MembershipService membershipService;

    @Transactional
    public TransactionResponse createBorrow(Authentication authentication, Long workspaceId, TransactionRequest request) {
        User borrower = userService.getCurrentUser(authentication);
        // require workspace membership + role before creating any transaction
        Role actorRole = membershipService.getRoleOrThrow(workspaceId, borrower.getId());
        assertCanCreate(actorRole);

        User lender = userService.findByEmail(request.counterpartyEmail().trim());
        validateParticipants(borrower.getId(), lender.getId());

        // Ensure both participants are members of this workspace (prevents cross-workspace leakage).
        membershipService.getRoleOrThrow(workspaceId, lender.getId());
        Workspace workspace = workspaceService.getWorkspace(workspaceId);

        LocalDate txDate = request.transactionDate() != null ? request.transactionDate() : LocalDate.now();

        BorrowTransaction savedTransaction = transactionRepository.save(BorrowTransaction.builder()
                .amount(request.amount())
                .borrower(borrower)
                .lender(lender)
                .workspace(workspace)
                .description(request.description().trim())
                .status(TransactionStatus.PENDING)
                .transactionDate(txDate)
                .build());
        return toResponse(savedTransaction);
    }

    @Transactional
    public TransactionResponse createLend(Authentication authentication, Long workspaceId, TransactionRequest request) {
        User lender = userService.getCurrentUser(authentication);
        Role actorRole = membershipService.getRoleOrThrow(workspaceId, lender.getId());
        assertCanCreate(actorRole);

        User borrower = userService.findByEmail(request.counterpartyEmail().trim());
        validateParticipants(lender.getId(), borrower.getId());

        membershipService.getRoleOrThrow(workspaceId, borrower.getId());
        Workspace workspace = workspaceService.getWorkspace(workspaceId);

        LocalDate txDate = request.transactionDate() != null ? request.transactionDate() : LocalDate.now();

        BorrowTransaction savedTransaction = transactionRepository.save(BorrowTransaction.builder()
                .amount(request.amount())
                .borrower(borrower)
                .lender(lender)
                .workspace(workspace)
                .description(request.description().trim())
                .status(TransactionStatus.PENDING)
                .transactionDate(txDate)
                .build());
        return toResponse(savedTransaction);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getWorkspaceTransactions(Authentication authentication, Long workspaceId) {
        User currentUser = userService.getCurrentUser(authentication);
        // Membership existence is enforced here even if controller already has @PreAuthorize.
        membershipService.getRoleOrThrow(workspaceId, currentUser.getId());

        return transactionRepository.findAllInvolvingUserInWorkspace(workspaceId, currentUser.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public TransactionResponse markAsPaid(Authentication authentication, Long workspaceId, Long transactionId) {
        User currentUser = userService.getCurrentUser(authentication);
        // must at least belong to the workspace to interact with its transactions
        membershipService.getRoleOrThrow(workspaceId, currentUser.getId());

        BorrowTransaction transaction = transactionRepository.findByIdAndWorkspaceId(transactionId, workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + transactionId));
        // only participants can change status (prevents marking other people's transactions as paid)
        assertInvolvedUser(transaction, currentUser.getId());
        transaction.setStatus(TransactionStatus.PAID);
        return toResponse(transactionRepository.save(transaction));
    }

    public TransactionResponse toResponse(BorrowTransaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getBorrower().getId(),
                transaction.getBorrower().getName(),
                transaction.getLender().getId(),
                transaction.getLender().getName(),
                transaction.getDescription(),
                transaction.getStatus(),
                transaction.getTransactionDate(),
                transaction.getCreatedAt());
    }

    private void validateParticipants(Long actorId, Long counterpartyId) {
        if (actorId.equals(counterpartyId)) {
            throw new IllegalArgumentException("Borrower and lender must be different users");
        }
    }

    private void assertCanCreate(Role role) {
        if (role == Role.VIEWER) {
            throw new UnauthorizedAccessException("Viewers cannot create transactions");
        }
    }

    private void assertInvolvedUser(BorrowTransaction transaction, Long userId) {
        boolean involved = transaction.getBorrower().getId().equals(userId) || transaction.getLender().getId().equals(userId);
        if (!involved) {
            throw new UnauthorizedAccessException("You are not allowed to access this transaction");
        }
    }
}

