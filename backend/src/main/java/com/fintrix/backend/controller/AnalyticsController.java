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
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Analytics endpoints")
@SecurityRequirement(name = "bearerAuth")
public class AnalyticsController {

    @GetMapping
    @Operation(summary = "Get analytics (placeholder)")
    @PreAuthorize("hasAnyRole('ANALYST','ADMIN')")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        // Keep simple for now; replace with real analytics later.
        return ResponseEntity.ok(Map.of("message", "analytics endpoint"));
    }
}

