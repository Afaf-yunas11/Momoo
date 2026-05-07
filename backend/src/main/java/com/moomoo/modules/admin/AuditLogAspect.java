package com.moomoo.modules.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moomoo.auth.UserPrincipal;
import java.time.Instant;
import java.lang.reflect.Method;
import java.util.UUID;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditLogAspect {

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    public AuditLogAspect(AuditLogRepository auditLogRepository, ObjectMapper objectMapper) {
        this.auditLogRepository = auditLogRepository;
        this.objectMapper = objectMapper;
    }

    @AfterReturning(
            pointcut = "execution(* com.moomoo.modules..*Controller.create*(..)) || " +
                    "execution(* com.moomoo.modules..*Controller.add*(..)) || " +
                    "execution(* com.moomoo.modules..*Controller.update*(..)) || " +
                    "execution(* com.moomoo.modules..*Controller.confirm*(..)) || " +
                    "execution(* com.moomoo.modules..*Controller.review*(..)) || " +
                    "execution(* com.moomoo.modules..*Controller.softDelete(..))",
            returning = "result")
    public void logWriteOperation(JoinPoint joinPoint, Object result) {
        AuditLog auditLog = new AuditLog();
        auditLog.setTimestamp(Instant.now());
        auditLog.setAction(joinPoint.getSignature().getName());
        auditLog.setEntityType(result == null ? "unknown" : result.getClass().getSimpleName());
        auditLog.setEntityId(extractEntityId(result));
        auditLog.setNewValue(safeJson(result));
        auditLog.setUserId(currentUserId());
        auditLogRepository.save(auditLog);
    }

    private String safeJson(Object value) {
        try {
            return value == null ? null : objectMapper.writeValueAsString(value);
        } catch (Exception ex) {
            return "{\"error\":\"serialization_failed\"}";
        }
    }

    private UUID currentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal principal) {
            return principal.getUserId();
        }
        return null;
    }

    private String extractEntityId(Object result) {
        if (result == null) {
            return null;
        }
        try {
            Method method = result.getClass().getMethod("id");
            Object value = method.invoke(result);
            return value == null ? null : String.valueOf(value);
        } catch (Exception ignored) {
            return null;
        }
    }
}
