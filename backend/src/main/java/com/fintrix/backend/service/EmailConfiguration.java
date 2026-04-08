package com.fintrix.backend.service;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EmailConfiguration {

    @Bean
    @ConditionalOnProperty(prefix = "spring.mail", name = "host")
    public EmailService smtpEmailService(org.springframework.mail.javamail.JavaMailSender mailSender) {
        return new SmtpEmailService(mailSender);
    }

    @Bean
    @ConditionalOnMissingBean(EmailService.class)
    public EmailService noOpEmailService() {
        // Avoid breaking local/dev/test environments where SMTP is not configured.
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

