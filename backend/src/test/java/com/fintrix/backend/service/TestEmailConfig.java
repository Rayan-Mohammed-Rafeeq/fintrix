package com.fintrix.backend.service;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@TestConfiguration
public class TestEmailConfig {

    @Bean
    @Primary
    public EmailService emailService() {
        // No-op email sender for tests (avoids requiring SMTP config and avoids failing context).
        return new EmailService() {
            @Override
            public void sendPasswordResetEmail(String toEmail, String resetUrl) {
                // no-op
            }

            @Override
            public void sendPasswordResetOtpEmail(String toEmail, String otp, int expiresMinutes) {
                // no-op
            }
        };
    }
}

