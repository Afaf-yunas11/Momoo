package com.moomoo.modules.animal;

import com.moomoo.common.AnimalStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record AnimalResponse(
        UUID id,
        String tagNumber,
        String name,
        String breed,
        LocalDate dateOfBirth,
        LocalDate purchaseDate,
        BigDecimal purchasePrice,
        AnimalStatus status,
        String notes
) {
}
