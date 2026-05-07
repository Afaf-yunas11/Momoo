package com.moomoo.modules.feed;

import com.moomoo.common.TenantEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "feed_inventory")
public class FeedInventory extends TenantEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "feed_type_id", nullable = false)
    private FeedType feedType;

    @Column(name = "stock_kg", precision = 10, scale = 2)
    private BigDecimal stockKg;

    @Column(name = "low_stock_threshold", precision = 10, scale = 2)
    private BigDecimal lowStockThreshold;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    public FeedType getFeedType() {
        return feedType;
    }

    public void setFeedType(FeedType feedType) {
        this.feedType = feedType;
    }

    public BigDecimal getStockKg() {
        return stockKg;
    }

    public void setStockKg(BigDecimal stockKg) {
        this.stockKg = stockKg;
    }

    public BigDecimal getLowStockThreshold() {
        return lowStockThreshold;
    }

    public void setLowStockThreshold(BigDecimal lowStockThreshold) {
        this.lowStockThreshold = lowStockThreshold;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
