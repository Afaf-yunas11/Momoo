package com.moomoo.common;

import com.moomoo.auth.UserPrincipal;
import java.util.UUID;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    public static UUID getCurrentFarmId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserPrincipal) {
            return ((UserPrincipal) principal).getFarmId();
        }
        return null;
    }
}
