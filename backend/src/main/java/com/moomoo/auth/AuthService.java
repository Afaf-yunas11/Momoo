package com.moomoo.auth;

import com.moomoo.exception.ResourceNotFoundException;
import com.moomoo.modules.admin.User;
import com.moomoo.modules.admin.UserRepository;
import com.moomoo.modules.admin.Farm;
import com.moomoo.modules.admin.FarmRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final FarmRepository farmRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager, JwtService jwtService, UserRepository userRepository,
                       FarmRepository farmRepository, RefreshTokenRepository refreshTokenRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.farmRepository = farmRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmailIgnoreCase(request.email()).isPresent()) {
            throw new BadCredentialsException("Email already registered");
        }

        Farm farm = new Farm();
        farm.setName(request.farmName());
        farm = farmRepository.save(farm);

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(com.moomoo.common.Role.OWNER);
        user.setFarmId(farm.getId());
        user = userRepository.save(user);

        UserPrincipal principal = new UserPrincipal(user);
        String token = jwtService.generateAccessToken(principal);
        return new AuthResponse(token, user.getEmail(), user.getRole(), user.getFarmId(), Instant.now().plus(30, ChronoUnit.MINUTES));
    }

    public LoginResult login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (user.isLocked()) {
            throw new BadCredentialsException("Account is temporarily locked");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        } catch (BadCredentialsException ex) {
            registerFailedAttempt(user);
            throw ex;
        }

        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        user.setLastLogin(Instant.now());
        userRepository.save(user);

        UserPrincipal principal = new UserPrincipal(user);
        JwtService.TokenPair tokens = jwtService.generateTokens(principal);
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setTokenHash(hashToken(tokens.refreshToken()));
        refreshToken.setExpiresAt(tokens.refreshExpiry());
        refreshTokenRepository.save(refreshToken);

        return new LoginResult(
                new AuthResponse(tokens.accessToken(), user.getEmail(), user.getRole(), user.getFarmId(), Instant.now().plus(30, ChronoUnit.MINUTES)),
                tokens.refreshToken()
        );
    }

    public AuthResponse refresh(String rawRefreshToken) {
        if (!jwtService.isRefreshToken(rawRefreshToken)) {
            throw new BadCredentialsException("Invalid refresh token");
        }

        RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(hashToken(rawRefreshToken))
                .orElseThrow(() -> new BadCredentialsException("Refresh token not found"));

        if (refreshToken.getRevokedAt() != null || refreshToken.getExpiresAt().isBefore(Instant.now())) {
            throw new BadCredentialsException("Refresh token expired or revoked");
        }

        User user = refreshToken.getUser();
        UserPrincipal principal = new UserPrincipal(user);
        String accessToken = jwtService.generateAccessToken(principal);
        return new AuthResponse(accessToken, user.getEmail(), user.getRole(), user.getFarmId(), Instant.now().plus(30, ChronoUnit.MINUTES));
    }

    public void logout(String rawRefreshToken) {
        refreshTokenRepository.findByTokenHash(hashToken(rawRefreshToken)).ifPresent(token -> {
            token.setRevokedAt(Instant.now());
            refreshTokenRepository.save(token);
        });
    }

    public String forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found for email: " + request.email()));
        return "Password reset flow will be connected to email service next";
    }

    private void registerFailedAttempt(User user) {
        int attempts = user.getFailedLoginAttempts() + 1;
        user.setFailedLoginAttempts(attempts);
        if (attempts >= 5) {
            user.setLockedUntil(Instant.now().plus(15, ChronoUnit.MINUTES));
            user.setFailedLoginAttempts(0);
        }
        userRepository.save(user);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(rawToken.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to hash refresh token", ex);
        }
    }

    public record LoginResult(AuthResponse authResponse, String refreshToken) {
    }
}
