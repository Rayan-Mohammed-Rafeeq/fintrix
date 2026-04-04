package com.fintrix.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@RequiredArgsConstructor
public class SmtpEmailService implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String from;

    @Override
    public void sendPasswordResetEmail(String toEmail, String resetUrl) {
        SimpleMailMessage message = new SimpleMailMessage();
        if (from != null && !from.isBlank()) {
            message.setFrom(from);
        }
        message.setTo(toEmail);
        message.setSubject("Reset your Fintrix password");
        message.setText("We received a request to reset your Fintrix password.\n\n"
                + "Reset link: " + resetUrl + "\n\n"
                + "If you did not request this, you can ignore this email.");

        mailSender.send(message);
    }
}

