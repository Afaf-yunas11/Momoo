package com.moomoo.modules.health;

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
@Table(name = "vaccinations")
public class Vaccination extends TenantEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "animal_id", nullable = false)
    private Animal animal;

    @Column(name = "vaccine_name", nullable = false)
    private String vaccineName;

    @Column(name = "batch_no")
    private String batchNo;

    @Column(name = "date_given", nullable = false)
    private LocalDate dateGiven;

    @Column(name = "dosage_ml", precision = 8, scale = 2)
    private BigDecimal dosageMl;

    @Column(name = "given_by")
    private String givenBy;

    @Column(name = "next_due_date")
    private LocalDate nextDueDate;

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    public String getVaccineName() {
        return vaccineName;
    }

    public void setVaccineName(String vaccineName) {
        this.vaccineName = vaccineName;
    }

    public String getBatchNo() {
        return batchNo;
    }

    public void setBatchNo(String batchNo) {
        this.batchNo = batchNo;
    }

    public LocalDate getDateGiven() {
        return dateGiven;
    }

    public void setDateGiven(LocalDate dateGiven) {
        this.dateGiven = dateGiven;
    }

    public BigDecimal getDosageMl() {
        return dosageMl;
    }

    public void setDosageMl(BigDecimal dosageMl) {
        this.dosageMl = dosageMl;
    }

    public String getGivenBy() {
        return givenBy;
    }

    public void setGivenBy(String givenBy) {
        this.givenBy = givenBy;
    }

    public LocalDate getNextDueDate() {
        return nextDueDate;
    }

    public void setNextDueDate(LocalDate nextDueDate) {
        this.nextDueDate = nextDueDate;
    }
}
