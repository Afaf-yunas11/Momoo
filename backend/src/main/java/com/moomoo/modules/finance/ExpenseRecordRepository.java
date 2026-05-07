package com.moomoo.modules.finance;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ExpenseRecordRepository extends JpaRepository<ExpenseRecord, UUID>, JpaSpecificationExecutor<ExpenseRecord> {
}
