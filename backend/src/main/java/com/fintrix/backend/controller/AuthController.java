package com.fintrix.backend.controller;

import com.fintrix.backend.dto.AuthResponse;
import com.fintrix.backend.dto.ForgotPasswordRequest;
import com.fintrix.backend.dto.RequestPasswordResetOtpRequest;
import com.fintrix.backend.dto.ResetPasswordRequest;
import com.fintrix.backend.dto.ResetPasswordWithOtpRequest;
import com.fintrix.backend.dto.LoginRequest;
import com.fintrix.backend.dto.RegisterRequest;
import com.fintrix.backend.dto.VerifyPasswordResetOtpRequest;
import com.fintrix.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "JWT registration and login APIs")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate a user and return a JWT")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Generate a password reset token (demo: returns token in response)")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password/request-otp")
    @Operation(summary = "Request a password reset OTP (code sent to email)")
    public ResponseEntity<Void> requestPasswordResetOtp(@Valid @RequestBody RequestPasswordResetOtpRequest request) {
        authService.requestPasswordResetOtp(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password/verify-otp")
    @Operation(summary = "Verify a password reset OTP")
    public ResponseEntity<Void> verifyPasswordResetOtp(@Valid @RequestBody VerifyPasswordResetOtpRequest request) {
        authService.verifyPasswordResetOtp(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password/reset-password")
    @Operation(summary = "Reset password using email + OTP")
    public ResponseEntity<Void> resetPasswordWithOtp(@Valid @RequestBody ResetPasswordWithOtpRequest request) {
        authService.resetPasswordWithOtp(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using a reset token")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok().build();
    }
}
