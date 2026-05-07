package com.moomoo.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long accessTokenMinutes;
    private final long refreshTokenDays;

    public JwtService(@Value("${app.security.jwt-secret}") String secret,
                      @Value("${app.security.access-token-minutes}") long accessTokenMinutes,
                      @Value("${app.security.refresh-token-days}") long refreshTokenDays) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.accessTokenMinutes = accessTokenMinutes;
        this.refreshTokenDays = refreshTokenDays;
    }

    public String generateAccessToken(UserPrincipal principal) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(principal.getUsername())
                .claim("uid", principal.getUserId().toString())
                .claim("role", principal.getRole().name())
                .claim("fid", principal.getFarmId() != null ? principal.getFarmId().toString() : "")
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(Duration.ofMinutes(accessTokenMinutes))))
                .signWith(signingKey)
                .compact();
    }

    public TokenPair generateTokens(UserPrincipal principal) {
        return new TokenPair(
                generateAccessToken(principal),
                generateRefreshToken(principal),
                Instant.now().plus(Duration.ofDays(refreshTokenDays))
        );
    }

    public String generateRefreshToken(UserPrincipal principal) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(principal.getUsername())
                .claim("uid", principal.getUserId().toString())
                .claim("type", "refresh")
                .claim("jti", UUID.randomUUID().toString())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(Duration.ofDays(refreshTokenDays))))
                .signWith(signingKey)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public UUID extractUserId(String token) {
        return UUID.fromString(String.valueOf(extractClaims(token).get("uid")));
    }

    public boolean isRefreshToken(String token) {
        return "refresh".equals(extractClaims(token).get("type"));
    }

    public boolean isValid(String token, UserPrincipal principal) {
        Claims claims = extractClaims(token);
        return claims.getSubject().equalsIgnoreCase(principal.getUsername())
                && claims.getExpiration().after(new Date());
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public record TokenPair(String accessToken, String refreshToken, Instant refreshExpiry) {
    }
}
