package com.moomoo.modules.animal;

import com.moomoo.common.AnimalStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public record AnimalRequest(
        @NotBlank String tagNumber,
        @NotBlank String name,
        @NotBlank String breed,
        LocalDate dateOfBirth,
        LocalDate purchaseDate,
        BigDecimal purchasePrice,
        @NotNull AnimalStatus status,
        String notes
) {
}
