package com.moomoo.modules.reproduction;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BreedingRecordRepository extends JpaRepository<BreedingRecord, UUID> {
}
