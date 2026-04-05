package com.fintrix.backend.security;

import com.fintrix.backend.enums.Role;
import com.fintrix.backend.service.MembershipService;
import com.fintrix.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("workspaceAuth")
@RequiredArgsConstructor
public class WorkspaceAuth {

    private final MembershipService membershipService;
    private final UserService userService;

    public boolean hasAnyRole(Authentication authentication, Long workspaceId, String... roles) {
        if (authentication == null || !authentication.isAuthenticated() || workspaceId == null) {
            // fail closed: missing auth or workspace context means no access
            return false;
        }

        Long userId = extractUserId(authentication);
        if (userId == null) {
            // couldn't resolve a real user from the principal (e.g., anonymous/invalid token)
            return false;
        }

        // membership lookup is the actual workspace RBAC gate (not the user's global role)
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
        // Most reliable: resolve from authentication name (email/subject) and load user.
        // Works across UsernamePasswordAuthenticationToken, JWT filter, etc.
        String email = authentication.getName();
        if (email == null || email.isBlank()) {
            return null;
        }
        return userService.findByEmail(email).getId();
    }
}

