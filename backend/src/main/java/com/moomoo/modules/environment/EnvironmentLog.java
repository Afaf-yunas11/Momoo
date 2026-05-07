package com.moomoo.modules.environment;

import com.moomoo.common.Season;
import com.moomoo.common.TenantEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "environment_logs")
public class EnvironmentLog extends TenantEntity {

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @Column(name = "max_temp_c", precision = 5, scale = 2)
    private BigDecimal maxTempC;

    @Column(name = "min_temp_c", precision = 5, scale = 2)
    private BigDecimal minTempC;

    @Column(name = "humidity_pct", precision = 5, scale = 2)
    private BigDecimal humidityPct;

    @Column(name = "thi_score", precision = 5, scale = 2)
    private BigDecimal thiScore;

    @Enumerated(EnumType.STRING)
    private Season season;

    @Column(columnDefinition = "text")
    private String notes;

    public LocalDate getLogDate() {
        return logDate;
    }

    public void setLogDate(LocalDate logDate) {
        this.logDate = logDate;
    }

    public BigDecimal getMaxTempC() {
        return maxTempC;
    }

    public void setMaxTempC(BigDecimal maxTempC) {
        this.maxTempC = maxTempC;
    }

    public BigDecimal getMinTempC() {
        return minTempC;
    }

    public void setMinTempC(BigDecimal minTempC) {
        this.minTempC = minTempC;
    }

    public BigDecimal getHumidityPct() {
        return humidityPct;
    }

    public void setHumidityPct(BigDecimal humidityPct) {
        this.humidityPct = humidityPct;
    }

    public BigDecimal getThiScore() {
        return thiScore;
    }

    public void setThiScore(BigDecimal thiScore) {
        this.thiScore = thiScore;
    }

    public Season getSeason() {
        return season;
    }

    public void setSeason(Season season) {
        this.season = season;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
