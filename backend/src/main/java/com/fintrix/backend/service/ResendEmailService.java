package com.fintrix.backend.service;

import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Email sender using Resend (https://resend.com) over HTTP.
 *
 * Resend avoids SMTP egress restrictions that are common on PaaS providers.
 */
public class ResendEmailService implements EmailService {

    private final WebClient webClient;

    @Value("${app.email.brand-name:Fintrix}")
    private String brandName;

    /**
     * Must be a verified sender/domain in Resend.
     * Example: "Fintrix <no-reply@yourdomain.com>"
     */
    @Value("${app.email.from:}")
    private String from;

    @Value("${app.email.brand-logo-url:${app.frontend.base-url:http://localhost:3000}/icon.svg}")
    private String brandLogoUrl;

    public ResendEmailService(String apiKey) {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.resend.com")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String resetUrl) {
        String subject = "Reset your " + brandName + " password";
        String html = "" +
                "<div style=\"font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#111827\">" +
                headerHtml() +
                "  <h2 style=\"margin:16px 0 8px;font-size:18px\">Reset your password</h2>" +
                "  <p style=\"margin:0 0 16px;color:#374151\">We received a request to reset your " + escape(brandName) + " password.</p>" +
                "  <p style=\"margin:0 0 16px\"><a href=\"" + escape(resetUrl) + "\" style=\"display:inline-block;background:#10B981;color:#000;padding:10px 14px;border-radius:10px;text-decoration:none;font-weight:700\">Reset password</a></p>" +
                "  <p style=\"margin:0 0 16px;color:#6B7280;font-size:12px\">If the button doesn't work, open this link: " + escape(resetUrl) + "</p>" +
                "  <p style=\"margin:16px 0 0;color:#6B7280;font-size:12px\">If you did not request this, you can ignore this email.</p>" +
                "</div>";

        send(toEmail, subject, html);
    }

    @Override
    public void sendPasswordResetOtpEmail(String toEmail, String otp, int expiresMinutes) {
        String subject = "Your " + brandName + " password reset code";
        String safeOtp = otp == null ? "" : otp;
        String html = "" +
                "<div style=\"font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#111827\">" +
                headerHtml() +
                "  <h2 style=\"margin:16px 0 8px;font-size:18px\">Your password reset code</h2>" +
                "  <p style=\"margin:0 0 16px;color:#374151\">We received a request to reset your " + escape(brandName) + " password.</p>" +
                "  <div style=\"border:1px solid #E5E7EB;border-radius:12px;padding:16px;background:#F9FAFB\">" +
                "    <div style=\"color:#6B7280;font-size:12px;margin-bottom:6px\">One-time code (OTP)</div>" +
                "    <div style=\"font-size:28px;letter-spacing:2px;font-weight:800\">" + escape(safeOtp) + "</div>" +
                "    <div style=\"margin-top:10px;color:#6B7280;font-size:12px\">Expires in " + expiresMinutes + " minutes.</div>" +
                "  </div>" +
                "  <p style=\"margin:16px 0 0;color:#6B7280;font-size:12px\">If you did not request this, you can ignore this email.</p>" +
                "</div>";

        send(toEmail, subject, html);
    }

    private void send(String toEmail, String subject, String html) {
        String resolvedFrom = (from == null || from.isBlank()) ? (brandName + " <no-reply@resend.dev>") : from;

        ResendEmailRequest payload = new ResendEmailRequest(
                resolvedFrom,
                List.of(toEmail),
                subject,
                html
        );

        // Block briefly so the request completes; BUT don't break UX if the provider rejects
        // (common in early setup: 403 if sender/domain not verified).
        try {
            webClient.post()
                    .uri("/emails")
                    .bodyValue(payload)
                    .retrieve()
                    .toBodilessEntity()
                    .block();
        } catch (WebClientResponseException e) {
            // Log and continue.
            // Note: Resend may return 403 if the FROM address/domain isn't verified.
            org.slf4j.LoggerFactory.getLogger(ResendEmailService.class)
                    .warn("[Resend] Failed to send email: status={} body={}", e.getStatusCode(), safeBody(e));
        } catch (RuntimeException e) {
            org.slf4j.LoggerFactory.getLogger(ResendEmailService.class)
                    .warn("[Resend] Failed to send email: {}", e.toString());
        }
    }

    private String safeBody(WebClientResponseException e) {
        try {
            String body = e.getResponseBodyAsString();
            if (body == null) return "";
            return body.length() > 2000 ? body.substring(0, 2000) + "..." : body;
        } catch (Exception ex) {
            return "";
        }
    }

    private String headerHtml() {
        String logo = (brandLogoUrl == null || brandLogoUrl.isBlank())
                ? ""
                : ("<img src=\"" + escape(brandLogoUrl) + "\" alt=\"" + escape(brandName)
                        + "\" width=\"32\" height=\"32\" style=\"display:block;border:0;outline:none;text-decoration:none\"/>");

        // Use a table-based header for maximum email-client compatibility (Gmail, Outlook, etc.).
        return ""
                + "  <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:100%;border-collapse:collapse;margin:0;padding:12px 0\">"
                + "    <tr>"
                + "      <td style=\"width:44px;vertical-align:middle\">" + logo + "</td>"
                + "      <td style=\"vertical-align:middle\">"
                + "        <div style=\"font-size:18px;font-weight:700;line-height:1.2\">" + escape(brandName) + "</div>"
                + "      </td>"
                + "    </tr>"
                + "  </table>";
    }

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }

    private record ResendEmailRequest(
            String from,
            List<String> to,
            String subject,
            String html
    ) {
    }
}

