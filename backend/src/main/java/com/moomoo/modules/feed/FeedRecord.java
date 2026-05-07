package com.moomoo.modules.feed;

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
@Table(name = "feed_records")
public class FeedRecord extends TenantEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "animal_id", nullable = false)
    private Animal animal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "feed_type_id")
    private FeedType feedType;

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;

    @Column(name = "quantity_kg", precision = 8, scale = 2)
    private BigDecimal quantityKg;

    @Column(name = "ai_recommended_qty", precision = 8, scale = 2)
    private BigDecimal aiRecommendedQty;

    @Column(name = "cost_pkr", precision = 10, scale = 2)
    private BigDecimal costPkr;

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    public FeedType getFeedType() {
        return feedType;
    }

    public void setFeedType(FeedType feedType) {
        this.feedType = feedType;
    }

    public LocalDate getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(LocalDate recordDate) {
        this.recordDate = recordDate;
    }

    public BigDecimal getQuantityKg() {
        return quantityKg;
    }

    public void setQuantityKg(BigDecimal quantityKg) {
        this.quantityKg = quantityKg;
    }

    public BigDecimal getAiRecommendedQty() {
        return aiRecommendedQty;
    }

    public void setAiRecommendedQty(BigDecimal aiRecommendedQty) {
        this.aiRecommendedQty = aiRecommendedQty;
    }

    public BigDecimal getCostPkr() {
        return costPkr;
    }

    public void setCostPkr(BigDecimal costPkr) {
        this.costPkr = costPkr;
    }
}
