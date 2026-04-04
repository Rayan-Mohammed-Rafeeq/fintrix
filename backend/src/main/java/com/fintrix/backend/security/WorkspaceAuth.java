package com.fintrix.backend.security;

import com.fintrix.backend.enums.Role;
import com.fintrix.backend.service.MembershipService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("workspaceAuth")
@RequiredArgsConstructor
public class WorkspaceAuth {

    private final MembershipService membershipService;

    public boolean hasAnyRole(Authentication authentication, Long workspaceId, String... roles) {
        if (authentication == null || !authentication.isAuthenticated() || workspaceId == null) {
            return false;
        }

        Long userId = extractUserId(authentication);
        if (userId == null) {
            return false;
        }

        Role actual = membershipService.getRoleOrThrow(workspaceId, userId);
        for (String r : roles) {
            if (r != null && actual.name().equalsIgnoreCase(r.trim())) {
                return true;
            }
        }
        return false;
    }

    public boolean isAdmin(Authentication authentication, Long workspaceId) {
        return hasAnyRole(authentication, workspaceId, "ADMIN");
    }

    private Long extractUserId(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof AuthenticatedUser) {
            return ((AuthenticatedUser) principal).getId();
        }
        return null;
    }
}

