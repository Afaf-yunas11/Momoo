package com.moomoo.modules.animal;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record WeightRecordResponse(
        UUID id,
        LocalDate recordedDate,
        BigDecimal weightKg,
        String recordedBy
) {
}
