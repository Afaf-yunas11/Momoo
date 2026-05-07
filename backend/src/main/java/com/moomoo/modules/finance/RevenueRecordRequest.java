package com.moomoo.modules.finance;

import com.moomoo.common.RevenueCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public record RevenueRecordRequest(
        @NotNull LocalDate recordDate,
        @NotNull RevenueCategory category,
        @NotNull @DecimalMin("0.0") BigDecimal amountPkr,
        String buyerName,
        BigDecimal quantity,
        BigDecimal ratePerUnit,
        String notes
) {
}
