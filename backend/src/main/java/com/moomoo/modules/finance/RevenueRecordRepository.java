package com.moomoo.modules.finance;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface RevenueRecordRepository extends JpaRepository<RevenueRecord, UUID>, JpaSpecificationExecutor<RevenueRecord> {
}
