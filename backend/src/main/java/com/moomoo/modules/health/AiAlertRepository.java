package com.moomoo.modules.health;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AiAlertRepository extends JpaRepository<AiAlert, UUID>, JpaSpecificationExecutor<AiAlert> {
}
