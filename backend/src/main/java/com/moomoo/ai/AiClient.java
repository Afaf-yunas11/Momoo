package com.moomoo.ai;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class AiClient {

    public Map<String, Object> getAnimalInsights(UUID animalId) {
        return Map.of(
                "animalId", animalId,
                "feedRecommendationKg", BigDecimal.valueOf(14.5),
                "diseaseRiskScore", 22,
                "breedingWindow", "Next 10 days",
                "profitRecommendation", "KEEP"
        );
    }
}
