package com.moomoo.modules.animal;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WeightRecordRepository extends JpaRepository<WeightRecord, UUID> {
    List<WeightRecord> findByAnimalIdOrderByRecordedDateDesc(UUID animalId);
}
