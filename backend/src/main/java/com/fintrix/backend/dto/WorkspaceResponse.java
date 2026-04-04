package com.fintrix.backend.dto;

public record WorkspaceResponse(
        Long id,
        String name,
        Long ownerId
) {
}

