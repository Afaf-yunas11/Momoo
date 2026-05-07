package com.moomoo.modules.finance;

import com.moomoo.common.ExpenseCategory;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record ExpenseRecordResponse(
        UUID id,
        LocalDate recordDate,
        ExpenseCategory category,
        BigDecimal amountPkr,
        String vendor,
        String invoiceNumber,
        String notes
) {
}
