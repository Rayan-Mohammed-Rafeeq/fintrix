package com.fintrix.backend.security;

import com.fintrix.backend.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties jwtProperties;

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        // embed minimal identity info used by the frontend and for debugging/auditing
        claims.put("userId", user.getId());
        claims.put("role", user.getRole().name());
        return generateToken(claims, user.getEmail());
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Long extractUserId(String token) {
        Number userId = extractAllClaims(token).get("userId", Number.class);
        return userId == null ? null : userId.longValue();
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        return extractUsername(token).equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(extractAllClaims(token));
    }

    private String generateToken(Map<String, Object> claims, String subject) {
        Instant now = Instant.now();
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(jwtProperties.expirationMs())))
                .signWith(getSigningKey())
                .compact();
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        String secret = jwtProperties.secret();
        // Backwards/Dev friendly: allow either base64-encoded secret (recommended)
        // or a raw string (converted to bytes).
        // JJWT's BASE64 decoder rejects URL-safe characters like '-' and '_',
        // so we only attempt base64 decoding if the string matches classic base64.
        if (looksLikeClassicBase64(secret)) {
            byte[] keyBytes = Decoders.BASE64.decode(secret);
            return Keys.hmacShaKeyFor(keyBytes);
        }
        // treat everything else as a literal secret (useful for local/dev env vars)
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    private boolean looksLikeClassicBase64(String value) {
        if (value == null) {
            return false;
        }
        String s = value.trim();
        if (s.isEmpty() || (s.length() % 4 != 0)) {
            return false;
        }
        // Classic base64 alphabet + optional padding.
        // If '-' or '_' are present it's likely base64url; treat as raw secret.
        return s.matches("^[A-Za-z0-9+/]+={0,2}$");
    }
}
