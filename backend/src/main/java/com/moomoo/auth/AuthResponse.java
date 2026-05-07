package com.moomoo.auth;

import com.moomoo.common.Role;
import java.time.Instant;
import java.util.UUID;

public record AuthResponse(
        String accessToken,
        String email,
        Role role,
        UUID farmId,
        Instant accessTokenExpiresAt
) {
}
