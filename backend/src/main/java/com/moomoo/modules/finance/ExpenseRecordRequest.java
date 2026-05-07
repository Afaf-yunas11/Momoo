package com.moomoo.modules.finance;

import com.moomoo.common.ExpenseCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseRecordRequest(
        @NotNull LocalDate recordDate,
        @NotNull ExpenseCategory category,
        @NotNull @DecimalMin("0.0") BigDecimal amountPkr,
        String vendor,
        String invoiceNumber,
        String notes
) {
}
