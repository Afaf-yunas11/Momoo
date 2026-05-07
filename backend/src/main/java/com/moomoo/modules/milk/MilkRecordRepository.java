package com.moomoo.modules.milk;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MilkRecordRepository extends JpaRepository<MilkRecord, UUID>, JpaSpecificationExecutor<MilkRecord> {
    List<MilkRecord> findByAnimalIdOrderByRecordDateDesc(UUID animalId);
}
