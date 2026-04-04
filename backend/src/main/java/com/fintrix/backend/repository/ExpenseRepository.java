package com.fintrix.backend.repository;

import com.fintrix.backend.entity.Expense;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserIdOrderByDateDescCreatedAtDesc(Long userId);

    Optional<Expense> findByIdAndUserId(Long id, Long userId);

    // Workspace-scoped (multi-tenant) queries
    List<Expense> findByWorkspaceIdOrderByDateDescCreatedAtDesc(Long workspaceId);

    Optional<Expense> findByIdAndWorkspaceId(Long id, Long workspaceId);
}
