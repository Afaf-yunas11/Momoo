package com.moomoo.modules.health;

import com.moomoo.common.AlertSeverity;
import com.moomoo.common.AlertType;
import java.time.Instant;
import java.util.UUID;

public record AiAlertResponse(
        UUID id,
        UUID animalId,
        String animalTag,
        AlertType alertType,
        AlertSeverity severity,
        String message,
        String recommendedAction,
        Instant createdAt,
        Instant reviewedAt,
        String reviewedBy
) {
}
