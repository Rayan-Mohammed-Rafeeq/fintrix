package com.fintrix.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RequestPasswordResetOtpRequest(
        @NotBlank @Email String email
) {
}

