package com.moomoo.modules.reproduction;

import com.moomoo.common.TenantEntity;
import com.moomoo.modules.animal.Animal;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "calving_records")
public class CalvingRecord extends TenantEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "animal_id", nullable = false)
    private Animal animal;

    @Column(name = "calving_date", nullable = false)
    private LocalDate calvingDate;

    @Column(name = "calf_sex")
    private String calfSex;

    @Column(name = "calf_weight_kg", precision = 8, scale = 2)
    private BigDecimal calfWeightKg;

    private String outcome;

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    public LocalDate getCalvingDate() {
        return calvingDate;
    }

    public void setCalvingDate(LocalDate calvingDate) {
        this.calvingDate = calvingDate;
    }

    public String getCalfSex() {
        return calfSex;
    }

    public void setCalfSex(String calfSex) {
        this.calfSex = calfSex;
    }

    public BigDecimal getCalfWeightKg() {
        return calfWeightKg;
    }

    public void setCalfWeightKg(BigDecimal calfWeightKg) {
        this.calfWeightKg = calfWeightKg;
    }

    public String getOutcome() {
        return outcome;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }
}
