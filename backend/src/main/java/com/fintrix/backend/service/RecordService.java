package com.fintrix.backend.service;

import com.fintrix.backend.dto.RecordRequest;
import com.fintrix.backend.dto.RecordResponse;
import com.fintrix.backend.entity.Transaction;
import com.fintrix.backend.entity.User;
import com.fintrix.backend.enums.TransactionType;
import com.fintrix.backend.exception.ResourceNotFoundException;
import com.fintrix.backend.repository.TransactionRepository;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecordService {

    private final TransactionRepository transactionRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<RecordResponse> getMyRecords(Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        return transactionRepository.findByUserIdOrderByDateDescCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public RecordResponse create(Authentication authentication, RecordRequest request) {
        User user = userService.getCurrentUser(authentication);

        Transaction saved = transactionRepository.save(Transaction.builder()
                .amount(request.amount())
                .type(TransactionType.valueOf(request.type().trim().toUpperCase()))
                .category(request.category().trim())
                .date(request.date())
                .description(request.description() == null ? null : request.description().trim())
                .user(user)
                .build());

        return toResponse(saved);
    }

    @Transactional
    public RecordResponse update(Authentication authentication, Long id, RecordRequest request) {
        User user = userService.getCurrentUser(authentication);

        Transaction tx = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Record not found with id: " + id));

        // Simple ownership check (keeps records private)
        if (!tx.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Record not found with id: " + id);
        }

        tx.setAmount(request.amount());
        tx.setType(TransactionType.valueOf(request.type().trim().toUpperCase()));
        tx.setCategory(request.category().trim());
        tx.setDate(request.date());
        tx.setDescription(request.description() == null ? null : request.description().trim());

        return toResponse(transactionRepository.save(tx));
    }

    @Transactional
    public void delete(Authentication authentication, Long id) {
        User user = userService.getCurrentUser(authentication);

        Transaction tx = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Record not found with id: " + id));

        if (!tx.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Record not found with id: " + id);
        }

        transactionRepository.delete(tx);
    }

    @Transactional(readOnly = true)
    public List<RecordResponse> filter(Authentication authentication,
                                      TransactionType type,
                                      String category,
                                      LocalDate start,
                                      LocalDate end) {
        User user = userService.getCurrentUser(authentication);

        String categoryQuery = category == null ? "" : category.trim();
        LocalDate startDate = start == null ? LocalDate.of(1970, 1, 1) : start;
        LocalDate endDate = end == null ? LocalDate.of(2999, 12, 31) : end;

        return transactionRepository
                .findByUserIdAndTypeAndCategoryContainingIgnoreCaseAndDateBetweenOrderByDateDescCreatedAtDesc(
                        user.getId(),
                        type,
                        categoryQuery,
                        startDate,
                        endDate
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public RecordResponse toResponse(Transaction tx) {
        return new RecordResponse(
                tx.getId(),
                tx.getAmount(),
                tx.getType(),
                tx.getCategory(),
                tx.getDate(),
                tx.getDescription(),
                tx.getUser().getId(),
                tx.getStatus(),
                tx.getCreatedAt()
        );
    }
}

