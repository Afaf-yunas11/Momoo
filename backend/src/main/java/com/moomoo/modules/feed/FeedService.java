package com.moomoo.modules.feed;

import com.moomoo.exception.ResourceNotFoundException;
import com.moomoo.modules.animal.AnimalRepository;
import com.moomoo.common.SecurityUtils;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class FeedService {

    private final FeedRecordRepository feedRecordRepository;
    private final FeedTypeRepository feedTypeRepository;
    private final FeedInventoryRepository feedInventoryRepository;
    private final AnimalRepository animalRepository;

    public FeedService(FeedRecordRepository feedRecordRepository, FeedTypeRepository feedTypeRepository,
                       FeedInventoryRepository feedInventoryRepository, AnimalRepository animalRepository) {
        this.feedRecordRepository = feedRecordRepository;
        this.feedTypeRepository = feedTypeRepository;
        this.feedInventoryRepository = feedInventoryRepository;
        this.animalRepository = animalRepository;
    }

    public List<FeedRecord> records() {
        UUID farmId = SecurityUtils.getCurrentFarmId();
        return feedRecordRepository.findAll().stream()
                .filter(r -> farmId == null || farmId.equals(r.getFarmId()))
                .toList();
    }

    public FeedRecord createRecord(UUID animalId, UUID feedTypeId, FeedRecord record) {
        record.setFarmId(SecurityUtils.getCurrentFarmId());
        record.setAnimal(animalRepository.findById(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + animalId)));
        if (feedTypeId != null) {
            record.setFeedType(feedTypeRepository.findById(feedTypeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Feed type not found: " + feedTypeId)));
        }
        if (record.getAiRecommendedQty() == null) {
            record.setAiRecommendedQty(BigDecimal.valueOf(12));
        }
        return feedRecordRepository.save(record);
    }

    public List<FeedType> feedTypes() {
        UUID farmId = SecurityUtils.getCurrentFarmId();
        return feedTypeRepository.findAll().stream()
                .filter(t -> farmId == null || farmId.equals(t.getFarmId()))
                .toList();
    }

    public FeedType createFeedType(FeedType feedType) {
        feedType.setFarmId(SecurityUtils.getCurrentFarmId());
        return feedTypeRepository.save(feedType);
    }

    public List<FeedInventory> inventory() {
        UUID farmId = SecurityUtils.getCurrentFarmId();
        return feedInventoryRepository.findAll().stream()
                .filter(i -> farmId == null || farmId.equals(i.getFarmId()))
                .toList();
    }

    public FeedInventory updateInventory(UUID id, FeedInventory payload) {
        FeedInventory inventory = feedInventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found: " + id));
        inventory.setStockKg(payload.getStockKg());
        inventory.setLowStockThreshold(payload.getLowStockThreshold());
        inventory.setLastUpdated(payload.getLastUpdated());
        return feedInventoryRepository.save(inventory);
    }

    public Map<String, Object> recommend(UUID animalId) {
        animalRepository.findById(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + animalId));
        return Map.of("animalId", animalId, "recommendedKg", BigDecimal.valueOf(14.5));
    }
}
