package com.moomoo.modules.admin;

import com.moomoo.common.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserUpdateRequest(
        @NotBlank String name,
        @Email @NotBlank String email,
        String password,
        @NotNull Role role,
        boolean active
) {
}
