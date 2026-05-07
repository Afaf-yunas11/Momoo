package com.moomoo.modules.finance;

import com.moomoo.common.RevenueCategory;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record RevenueRecordResponse(
        UUID id,
        LocalDate recordDate,
        RevenueCategory category,
        BigDecimal amountPkr,
        String buyerName,
        BigDecimal quantity,
        BigDecimal ratePerUnit,
        String notes
) {
}
