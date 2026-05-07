package com.moomoo.modules.finance;

import com.moomoo.common.RevenueCategory;
import com.moomoo.common.TenantEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "revenue_records")
public class RevenueRecord extends TenantEntity {

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RevenueCategory category;

    @Column(name = "amount_pkr", nullable = false, precision = 12, scale = 2)
    private BigDecimal amountPkr;

    @Column(name = "buyer_name")
    private String buyerName;

    private BigDecimal quantity;

    @Column(name = "rate_per_unit", precision = 10, scale = 2)
    private BigDecimal ratePerUnit;

    private String notes;

    public LocalDate getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(LocalDate recordDate) {
        this.recordDate = recordDate;
    }

    public RevenueCategory getCategory() {
        return category;
    }

    public void setCategory(RevenueCategory category) {
        this.category = category;
    }

    public BigDecimal getAmountPkr() {
        return amountPkr;
    }

    public void setAmountPkr(BigDecimal amountPkr) {
        this.amountPkr = amountPkr;
    }

    public String getBuyerName() {
        return buyerName;
    }

    public void setBuyerName(String buyerName) {
        this.buyerName = buyerName;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getRatePerUnit() {
        return ratePerUnit;
    }

    public void setRatePerUnit(BigDecimal ratePerUnit) {
        this.ratePerUnit = ratePerUnit;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
