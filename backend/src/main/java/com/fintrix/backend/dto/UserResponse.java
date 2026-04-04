package com.fintrix.backend.dto;

import com.fintrix.backend.enums.Role;
import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String name,
        String email,
        Role role,
        LocalDateTime createdAt
) {
}

