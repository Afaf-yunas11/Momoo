package com.moomoo.modules.milk;

import com.moomoo.common.MilkSession;
import com.moomoo.common.TenantEntity;
import com.moomoo.modules.animal.Animal;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "milk_records")
public class MilkRecord extends TenantEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "animal_id", nullable = false)
    private Animal animal;

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MilkSession session;

    @Column(name = "morning_yield", precision = 8, scale = 2)
    private BigDecimal morningYield;

    @Column(name = "evening_yield", precision = 8, scale = 2)
    private BigDecimal eveningYield;

    @Column(name = "total_yield", precision = 8, scale = 2)
    private BigDecimal totalYield;

    @Column(name = "fat_pct", precision = 5, scale = 2)
    private BigDecimal fatPct;

    @Column(name = "protein_pct", precision = 5, scale = 2)
    private BigDecimal proteinPct;

    private Long scc;

    @Column(name = "bacterial_load")
    private Long bacterialLoad;

    @Column(name = "machine_used")
    private Boolean machineUsed;

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    public LocalDate getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(LocalDate recordDate) {
        this.recordDate = recordDate;
    }

    public MilkSession getSession() {
        return session;
    }

    public void setSession(MilkSession session) {
        this.session = session;
    }

    public BigDecimal getMorningYield() {
        return morningYield;
    }

    public void setMorningYield(BigDecimal morningYield) {
        this.morningYield = morningYield;
    }

    public BigDecimal getEveningYield() {
        return eveningYield;
    }

    public void setEveningYield(BigDecimal eveningYield) {
        this.eveningYield = eveningYield;
    }

    public BigDecimal getTotalYield() {
        return totalYield;
    }

    public void setTotalYield(BigDecimal totalYield) {
        this.totalYield = totalYield;
    }

    public BigDecimal getFatPct() {
        return fatPct;
    }

    public void setFatPct(BigDecimal fatPct) {
        this.fatPct = fatPct;
    }

    public BigDecimal getProteinPct() {
        return proteinPct;
    }

    public void setProteinPct(BigDecimal proteinPct) {
        this.proteinPct = proteinPct;
    }

    public Long getScc() {
        return scc;
    }

    public void setScc(Long scc) {
        this.scc = scc;
    }

    public Long getBacterialLoad() {
        return bacterialLoad;
    }

    public void setBacterialLoad(Long bacterialLoad) {
        this.bacterialLoad = bacterialLoad;
    }

    public Boolean getMachineUsed() {
        return machineUsed;
    }

    public void setMachineUsed(Boolean machineUsed) {
        this.machineUsed = machineUsed;
    }
}
