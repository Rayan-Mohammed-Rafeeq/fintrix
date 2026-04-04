package com.fintrix.backend.dto;

import com.fintrix.backend.enums.Role;

public record AuthResponse(
        String token,
        String tokenType,
        Long userId,
        String name,
        String email,
        Role role
) {
}
