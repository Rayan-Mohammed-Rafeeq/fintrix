package com.fintrix.backend.repository;

import com.fintrix.backend.entity.Transaction;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdOrderByDateDescCreatedAtDesc(Long userId);

    List<Transaction> findByUserIdAndTypeAndCategoryContainingIgnoreCaseAndDateBetweenOrderByDateDescCreatedAtDesc(
            Long userId,
            com.fintrix.backend.enums.TransactionType type,
            String category,
            LocalDate start,
            LocalDate end
    );
}

