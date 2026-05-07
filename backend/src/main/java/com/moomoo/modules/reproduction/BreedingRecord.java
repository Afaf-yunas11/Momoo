package com.moomoo.modules.reproduction;

import com.moomoo.common.BreedingMethod;
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
import java.time.LocalDate;

@Entity
@Table(name = "breeding_records")
public class BreedingRecord extends TenantEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "animal_id", nullable = false)
    private Animal animal;

    @Column(name = "breeding_date", nullable = false)
    private LocalDate breedingDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BreedingMethod method;

    @Column(name = "bull_id")
    private String bullId;

    @Column(name = "semen_batch")
    private String semenBatch;

    private String technician;

    @Column(name = "pregnancy_confirmed")
    private Boolean pregnancyConfirmed;

    @Column(name = "confirmation_date")
    private LocalDate confirmationDate;

    @Column(name = "expected_calving")
    private LocalDate expectedCalving;

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    public LocalDate getBreedingDate() {
        return breedingDate;
    }

    public void setBreedingDate(LocalDate breedingDate) {
        this.breedingDate = breedingDate;
    }

    public BreedingMethod getMethod() {
        return method;
    }

    public void setMethod(BreedingMethod method) {
        this.method = method;
    }

    public String getBullId() {
        return bullId;
    }

    public void setBullId(String bullId) {
        this.bullId = bullId;
    }

    public String getSemenBatch() {
        return semenBatch;
    }

    public void setSemenBatch(String semenBatch) {
        this.semenBatch = semenBatch;
    }

    public String getTechnician() {
        return technician;
    }

    public void setTechnician(String technician) {
        this.technician = technician;
    }

    public Boolean getPregnancyConfirmed() {
        return pregnancyConfirmed;
    }

    public void setPregnancyConfirmed(Boolean pregnancyConfirmed) {
        this.pregnancyConfirmed = pregnancyConfirmed;
    }

    public LocalDate getConfirmationDate() {
        return confirmationDate;
    }

    public void setConfirmationDate(LocalDate confirmationDate) {
        this.confirmationDate = confirmationDate;
    }

    public LocalDate getExpectedCalving() {
        return expectedCalving;
    }

    public void setExpectedCalving(LocalDate expectedCalving) {
        this.expectedCalving = expectedCalving;
    }
}
