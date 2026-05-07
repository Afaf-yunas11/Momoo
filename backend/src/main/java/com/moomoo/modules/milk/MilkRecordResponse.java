package com.moomoo.modules.milk;

import com.moomoo.common.MilkSession;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record MilkRecordResponse(
        UUID id,
        UUID animalId,
        String animalTag,
        LocalDate recordDate,
        MilkSession session,
        BigDecimal morningYield,
        BigDecimal eveningYield,
        BigDecimal totalYield,
        BigDecimal fatPct,
        BigDecimal proteinPct,
        Long scc,
        Long bacterialLoad,
        Boolean machineUsed
) {
}
