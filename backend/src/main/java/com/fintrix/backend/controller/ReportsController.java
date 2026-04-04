package com.fintrix.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Reports endpoints")
@SecurityRequirement(name = "bearerAuth")
public class ReportsController {

    @GetMapping
    @Operation(summary = "Get reports (placeholder)")
    @PreAuthorize("hasAnyRole('ANALYST','ADMIN')")
    public ResponseEntity<Map<String, Object>> getReports() {
        // Keep simple for now; replace with real reporting later.
        return ResponseEntity.ok(Map.of("message", "reports endpoint"));
    }
}

