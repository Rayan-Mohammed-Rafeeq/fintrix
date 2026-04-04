package com.fintrix.backend.controller;

import com.fintrix.backend.dto.RecordRequest;
import com.fintrix.backend.dto.RecordResponse;
import com.fintrix.backend.enums.TransactionType;
import com.fintrix.backend.service.RecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/records")
@RequiredArgsConstructor
@Tag(name = "Records", description = "Financial records (income/expense) APIs")
@SecurityRequirement(name = "bearerAuth")
public class RecordController {

    private final RecordService recordService;

    /**
     * VIEWER: allowed
     */
    @GetMapping
    @Operation(summary = "Get records for the logged-in user")
    @PreAuthorize("hasAnyRole('VIEWER','ANALYST','ADMIN')")
    public ResponseEntity<List<RecordResponse>> getMyRecords(Authentication authentication) {
        return ResponseEntity.ok(recordService.getMyRecords(authentication));
    }

    /**
     * ADMIN: create
     */
    @PostMapping
    @Operation(summary = "Create a record")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RecordResponse> create(Authentication authentication,
                                                 @Valid @RequestBody RecordRequest request) {
        return ResponseEntity.ok(recordService.create(authentication, request));
    }

    /**
     * ADMIN: update
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update a record")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RecordResponse> update(Authentication authentication,
                                                 @PathVariable Long id,
                                                 @Valid @RequestBody RecordRequest request) {
        return ResponseEntity.ok(recordService.update(authentication, id, request));
    }

    /**
     * ADMIN: delete
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a record")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable Long id) {
        recordService.delete(authentication, id);
        return ResponseEntity.noContent().build();
    }

    /**
     * ANALYST-only: filter endpoint
     */
    @GetMapping("/filter")
    @Operation(summary = "Filter records (ANALYST only)")
    @PreAuthorize("hasAnyRole('ANALYST','ADMIN')")
    public ResponseEntity<List<RecordResponse>> filter(Authentication authentication,
                                                       @RequestParam TransactionType type,
                                                       @RequestParam(required = false) String category,
                                                       @RequestParam(required = false)
                                                       @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                                                       LocalDate start,
                                                       @RequestParam(required = false)
                                                       @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                                                       LocalDate end) {
        return ResponseEntity.ok(recordService.filter(authentication, type, category, start, end));
    }
}

