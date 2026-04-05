package com.fintrix.backend.controller;

import com.fintrix.backend.dto.CreateWorkspaceRequest;
import com.fintrix.backend.dto.WorkspaceResponse;
import com.fintrix.backend.service.WorkspaceService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @GetMapping
    @Operation(summary = "List workspaces the logged-in user belongs to")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<WorkspaceResponse>> getMyWorkspaces(Authentication authentication) {
        return ResponseEntity.ok(workspaceService.getMyWorkspaces(authentication));
    }

    @PostMapping
    @Operation(summary = "Create a new workspace (creator becomes ADMIN)")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<WorkspaceResponse> createWorkspace(Authentication authentication,
                                                            @Valid @RequestBody CreateWorkspaceRequest request) {
        return ResponseEntity.ok(workspaceService.createWorkspace(authentication, request.name()));
    }

    @DeleteMapping("/{workspaceId}")
    @Operation(summary = "Delete a workspace (ADMIN only)")
    @PreAuthorize("@workspaceAuth.isAdmin(authentication, #workspaceId)")
    public ResponseEntity<Void> deleteWorkspace(Authentication authentication, @PathVariable Long workspaceId) {
        workspaceService.deleteWorkspace(authentication, workspaceId);
        return ResponseEntity.noContent().build();
    }
}

