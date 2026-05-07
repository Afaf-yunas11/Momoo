package com.moomoo.common;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import java.util.UUID;

@MappedSuperclass
public abstract class TenantEntity extends BaseEntity {

    @Column(name = "farm_id", nullable = false)
    private UUID farmId;

    public UUID getFarmId() {
        return farmId;
    }

    public void setFarmId(UUID farmId) {
        this.farmId = farmId;
    }
}
