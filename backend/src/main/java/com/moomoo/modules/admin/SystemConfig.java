package com.moomoo.modules.admin;

import com.moomoo.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "system_config")
public class SystemConfig extends BaseEntity {

    @Column(name = "farm_name")
    private String farmName;

    private String currency;

    @Column(name = "default_language")
    private String defaultLanguage;

    @Column(name = "scc_threshold")
    private Long sccThreshold;

    @Column(name = "weight_trigger_threshold")
    private Integer weightTriggerThreshold;

    @Column(name = "ai_service_url")
    private String aiServiceUrl;

    public String getFarmName() {
        return farmName;
    }

    public void setFarmName(String farmName) {
        this.farmName = farmName;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getDefaultLanguage() {
        return defaultLanguage;
    }

    public void setDefaultLanguage(String defaultLanguage) {
        this.defaultLanguage = defaultLanguage;
    }

    public Long getSccThreshold() {
        return sccThreshold;
    }

    public void setSccThreshold(Long sccThreshold) {
        this.sccThreshold = sccThreshold;
    }

    public Integer getWeightTriggerThreshold() {
        return weightTriggerThreshold;
    }

    public void setWeightTriggerThreshold(Integer weightTriggerThreshold) {
        this.weightTriggerThreshold = weightTriggerThreshold;
    }

    public String getAiServiceUrl() {
        return aiServiceUrl;
    }

    public void setAiServiceUrl(String aiServiceUrl) {
        this.aiServiceUrl = aiServiceUrl;
    }
}
