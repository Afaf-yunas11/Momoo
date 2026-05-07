package com.moomoo.modules.health;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiseaseRecordRepository extends JpaRepository<DiseaseRecord, UUID> {
}
