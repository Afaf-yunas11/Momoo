package com.moomoo.modules.milk;

import com.moomoo.common.MilkSession;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record MilkRecordRequest(
        @NotNull UUID animalId,
        @NotNull LocalDate recordDate,
        @NotNull MilkSession session,
        @DecimalMin("0.0") BigDecimal morningYield,
        @DecimalMin("0.0") BigDecimal eveningYield,
        @DecimalMin("1.0") @DecimalMax("10.0") BigDecimal fatPct,
        @DecimalMin("0.0") BigDecimal proteinPct,
        Long scc,
        Long bacterialLoad,
        Boolean machineUsed
) {
}
