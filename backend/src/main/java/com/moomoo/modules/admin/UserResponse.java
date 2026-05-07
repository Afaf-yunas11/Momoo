package com.moomoo.modules.admin;

import com.moomoo.common.Role;
import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String name,
        String email,
        Role role,
        boolean active,
        Instant lastLogin
) {
}
