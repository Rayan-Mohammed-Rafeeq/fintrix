package com.fintrix.backend.service;

public interface EmailService {
    void sendPasswordResetEmail(String toEmail, String resetUrl);

    void sendPasswordResetOtpEmail(String toEmail, String otp, int expiresMinutes);
}

