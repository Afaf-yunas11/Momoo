package com.moomoo.modules.feed;

import com.moomoo.common.TenantEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "feed_types")
public class FeedType extends TenantEntity {

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "dry_matter_pct", precision = 5, scale = 2)
    private BigDecimal dryMatterPct;

    @Column(name = "crude_protein_pct", precision = 5, scale = 2)
    private BigDecimal crudeProteinPct;

    @Column(name = "energy_mj", precision = 8, scale = 2)
    private BigDecimal energyMj;

    @Column(name = "fiber_pct", precision = 5, scale = 2)
    private BigDecimal fiberPct;

    @Column(name = "cost_per_kg", precision = 10, scale = 2)
    private BigDecimal costPerKg;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getDryMatterPct() {
        return dryMatterPct;
    }

    public void setDryMatterPct(BigDecimal dryMatterPct) {
        this.dryMatterPct = dryMatterPct;
    }

    public BigDecimal getCrudeProteinPct() {
        return crudeProteinPct;
    }

    public void setCrudeProteinPct(BigDecimal crudeProteinPct) {
        this.crudeProteinPct = crudeProteinPct;
    }

    public BigDecimal getEnergyMj() {
        return energyMj;
    }

    public void setEnergyMj(BigDecimal energyMj) {
        this.energyMj = energyMj;
    }

    public BigDecimal getFiberPct() {
        return fiberPct;
    }

    public void setFiberPct(BigDecimal fiberPct) {
        this.fiberPct = fiberPct;
    }

    public BigDecimal getCostPerKg() {
        return costPerKg;
    }

    public void setCostPerKg(BigDecimal costPerKg) {
        this.costPerKg = costPerKg;
    }
}
