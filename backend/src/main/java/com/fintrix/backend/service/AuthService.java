package com.fintrix.backend.service;

import com.fintrix.backend.dto.AuthResponse;
import com.fintrix.backend.dto.ForgotPasswordRequest;
import com.fintrix.backend.dto.LoginRequest;
import com.fintrix.backend.dto.RegisterRequest;
import com.fintrix.backend.dto.ResetPasswordRequest;
import com.fintrix.backend.entity.PasswordResetToken;
import com.fintrix.backend.exception.DuplicateResourceException;
import com.fintrix.backend.entity.User;
import com.fintrix.backend.enums.Role;
import com.fintrix.backend.enums.UserStatus;
import com.fintrix.backend.repository.PasswordResetTokenRepository;
import com.fintrix.backend.repository.UserRepository;
import com.fintrix.backend.security.JwtService;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final WorkspaceService workspaceService;
    private final EmailService emailService;
    private final Environment environment;

    @Value("${app.frontend.base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("An account with this email already exists");
        }

        User user = User.builder()
                .name(request.name().trim())
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                // Global role is no longer used for authorization; keep ADMIN to preserve existing flows.
                // Workspace membership roles are the source of truth.
                .role(Role.ADMIN)
                .status(UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);

        // Personal workspace + ADMIN membership
        workspaceService.createWorkspaceFor(savedUser, savedUser.getName().trim() + "'s Workspace");
        return toAuthResponse(savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
        return toAuthResponse(user);
    }

    /**
     * Forgot password flow (beginner-friendly): we generate a one-time token and log it.
     * In real production, you would email this token to the user.
     */
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String email = normalizeEmail(request.email());

        // Don't reveal whether an email exists.
        userRepository.findByEmail(email).ifPresent(user -> {
            // Invalidate older tokens for this user (single valid token policy).
            passwordResetTokenRepository.markAllTokensUsedForUser(user.getId());

            String token = UUID.randomUUID().toString();
            String resetLink = frontendBaseUrl.replaceAll("/+$", "") + "/reset-password?token=" + token;
            PasswordResetToken prt = PasswordResetToken.builder()
                    .token(token)
                    .user(user)
                    .expiresAt(LocalDateTime.now().plusMinutes(30))
                    .used(false)
                    .build();
            passwordResetTokenRepository.save(prt);

            // Send email (real flow). If mail isn't configured, this may throw; we avoid breaking
            // the API contract by only attempting in non-test environments.
            emailService.sendPasswordResetEmail(email, resetLink);

            // Dev helper: print token in server logs only for local/dev profiles.
            boolean isDev = environment != null && (environment.matchesProfiles("dev") || environment.matchesProfiles("local"));
            if (isDev) {
                System.out.println("[Fintrix] Password reset token for " + email + ": " + token);
            }
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken prt = passwordResetTokenRepository.findByToken(request.token())
                .orElseThrow(() -> new BadCredentialsException("Invalid or expired reset token"));

        if (prt.isUsed() || prt.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadCredentialsException("Invalid or expired reset token");
        }

        User user = prt.getUser();
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        prt.setUsed(true);
        passwordResetTokenRepository.save(prt);
    }

    private AuthResponse toAuthResponse(User user) {
        return new AuthResponse(
                jwtService.generateToken(user),
                "Bearer",
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole());
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}
