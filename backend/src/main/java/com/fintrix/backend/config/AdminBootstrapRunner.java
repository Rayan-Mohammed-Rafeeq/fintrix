package com.fintrix.backend.config;

import com.fintrix.backend.entity.User;
import com.fintrix.backend.enums.Role;
import com.fintrix.backend.enums.UserStatus;
import com.fintrix.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminBootstrapRunner implements ApplicationRunner {

    private final AdminBootstrapProperties properties;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        if (!properties.enabled()) {
            return;
        }

        if (!StringUtils.hasText(properties.email())
                || !StringUtils.hasText(properties.password())
                || !StringUtils.hasText(properties.name())) {
            log.warn("Admin bootstrap is enabled, but name/email/password are incomplete. Skipping admin creation.");
            return;
        }

        String normalizedEmail = properties.email().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            log.info("Admin bootstrap skipped because user already exists for email {}", normalizedEmail);
            return;
        }

        User admin = User.builder()
                .name(properties.name().trim())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(properties.password()))
                .role(Role.ADMIN)
                .status(UserStatus.ACTIVE)
                .build();
        userRepository.save(admin);
        log.info("Bootstrapped admin user {}", normalizedEmail);
    }
}

