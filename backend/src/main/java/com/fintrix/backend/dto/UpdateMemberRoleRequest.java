package com.fintrix.backend.dto;

import com.fintrix.backend.enums.Role;
import jakarta.validation.constraints.NotNull;

public record UpdateMemberRoleRequest(
        @NotNull(message = "Role is required")
        Role role
) {
}

