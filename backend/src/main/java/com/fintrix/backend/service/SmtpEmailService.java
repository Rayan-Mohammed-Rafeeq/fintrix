package com.fintrix.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@RequiredArgsConstructor
public class SmtpEmailService implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String from;

    /**
     * Publicly reachable URL for the Fintrix logo used in HTML emails.
     * In production, point this to your deployed frontend (e.g. https://fintrix.app/icon.svg).
     */
    @Value("${app.email.brand-logo-url:${app.frontend.base-url:http://localhost:3000}/icon.svg}")
    private String brandLogoUrl;

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

    @Override
    public void sendPasswordResetOtpEmail(String toEmail, String otp, int expiresMinutes) {
        // Use HTML email so we can show branding (logo) nicely in Gmail.
        // We reference the public logo URL rather than attaching images to keep it simple.
        String logoUrl = (brandLogoUrl == null || brandLogoUrl.isBlank())
                ? "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/letterboxd.svg"
                : brandLogoUrl;

        String safeOtp = otp == null ? "" : otp;
        String html = "" +
                "<div style=\"font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#111827\">" +
                "  <div style=\"display:flex;align-items:center;gap:12px;padding:12px 0\">" +
                "    <img src=\"" + logoUrl + "\" alt=\"Fintrix\" width=\"32\" height=\"32\" style=\"display:block\"/>" +
                "    <div style=\"font-size:18px;font-weight:700\">Fintrix</div>" +
                "  </div>" +
                "  <h2 style=\"margin:16px 0 8px;font-size:18px\">Your password reset code</h2>" +
                "  <p style=\"margin:0 0 16px;color:#374151\">We received a request to reset your Fintrix password.</p>" +
                "  <div style=\"border:1px solid #E5E7EB;border-radius:12px;padding:16px;background:#F9FAFB\">" +
                "    <div style=\"color:#6B7280;font-size:12px;margin-bottom:6px\">One-time code (OTP)</div>" +
                "    <div style=\"font-size:28px;letter-spacing:2px;font-weight:800\">" + safeOtp + "</div>" +
                "    <div style=\"margin-top:10px;color:#6B7280;font-size:12px\">Expires in " + expiresMinutes + " minutes.</div>" +
                "  </div>" +
                "  <p style=\"margin:16px 0 0;color:#6B7280;font-size:12px\">If you did not request this, you can ignore this email.</p>" +
                "</div>";

        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, "UTF-8");
            if (from != null && !from.isBlank()) {
                helper.setFrom(from);
            }
            helper.setTo(toEmail);
            helper.setSubject("Your Fintrix password reset code");
            helper.setText(html, true);
            mailSender.send(mime);
        } catch (MessagingException e) {
            // Fallback to plain text if HTML message creation fails for any reason.
            SimpleMailMessage message = new SimpleMailMessage();
            if (from != null && !from.isBlank()) {
                message.setFrom(from);
            }
            message.setTo(toEmail);
            message.setSubject("Your Fintrix password reset code");
            message.setText("We received a request to reset your Fintrix password.\n\n"
                    + "Your one-time code (OTP): " + safeOtp + "\n"
                    + "This code expires in " + expiresMinutes + " minutes.\n\n"
                    + "If you did not request this, you can ignore this email.");
            mailSender.send(message);
        }
    }
}

