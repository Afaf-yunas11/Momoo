package com.moomoo.modules.animal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public record WeightRecordRequest(
        @NotNull LocalDate recordedDate,
        @NotNull @DecimalMin("1.0") BigDecimal weightKg,
        @NotBlank String recordedBy
) {
}
