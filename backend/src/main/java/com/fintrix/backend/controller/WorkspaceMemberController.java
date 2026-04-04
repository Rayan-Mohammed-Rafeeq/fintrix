package com.fintrix.backend.controller;

import com.fintrix.backend.dto.InviteMemberRequest;
import com.fintrix.backend.dto.UpdateMemberRoleRequest;
import com.fintrix.backend.entity.Membership;
import com.fintrix.backend.service.MembershipService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/workspaces/{workspaceId}/members")
@RequiredArgsConstructor
public class WorkspaceMemberController {

    private final MembershipService membershipService;

    @PostMapping
    @Operation(summary = "Invite (add) an existing user to a workspace with a role")
    @PreAuthorize("@workspaceAuth.isAdmin(authentication, #workspaceId)")
    public ResponseEntity<Membership> invite(Authentication authentication,
                                            @PathVariable Long workspaceId,
                                            @Valid @RequestBody InviteMemberRequest request) {
        // authentication param kept for consistency/logging; authorization handled by @PreAuthorize
        return ResponseEntity.ok(membershipService.inviteMember(workspaceId, request));
    }

    @GetMapping
    @Operation(summary = "List members in a workspace")
    @PreAuthorize("@workspaceAuth.hasAnyRole(authentication, #workspaceId, 'VIEWER','ANALYST','ADMIN')")
    public ResponseEntity<List<Membership>> listMembers(@PathVariable Long workspaceId) {
        return ResponseEntity.ok(membershipService.listMembers(workspaceId));
    }

    @PutMapping("/{userId}/role")
    @Operation(summary = "Change a member's role in a workspace (ADMIN only)")
    @PreAuthorize("@workspaceAuth.isAdmin(authentication, #workspaceId)")
    public ResponseEntity<Membership> updateRole(@PathVariable Long workspaceId,
                                                @PathVariable Long userId,
                                                @Valid @RequestBody UpdateMemberRoleRequest request) {
        return ResponseEntity.ok(membershipService.updateMemberRole(workspaceId, userId, request));
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "Remove a member from a workspace (ADMIN only)")
    @PreAuthorize("@workspaceAuth.isAdmin(authentication, #workspaceId)")
    public ResponseEntity<Void> removeMember(@PathVariable Long workspaceId, @PathVariable Long userId) {
        membershipService.removeMember(workspaceId, userId);
        return ResponseEntity.noContent().build();
    }
}

