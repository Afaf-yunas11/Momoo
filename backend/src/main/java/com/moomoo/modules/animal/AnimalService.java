package com.moomoo.modules.animal;

import com.moomoo.ai.AiClient;
import com.moomoo.common.AlertSeverity;
import com.moomoo.common.AlertType;
import com.moomoo.common.PagedResponse;
import com.moomoo.common.SecurityUtils;
import com.moomoo.exception.ResourceNotFoundException;
import com.moomoo.modules.admin.SystemConfig;
import com.moomoo.modules.admin.SystemConfigRepository;
import com.moomoo.modules.health.AiAlert;
import com.moomoo.modules.health.AiAlertRepository;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class AnimalService {

    private final AnimalRepository animalRepository;
    private final WeightRecordRepository weightRecordRepository;
    private final AiAlertRepository aiAlertRepository;
    private final SystemConfigRepository systemConfigRepository;
    private final AiClient aiClient;

    public AnimalService(AnimalRepository animalRepository,
                         WeightRecordRepository weightRecordRepository,
                         AiAlertRepository aiAlertRepository,
                         SystemConfigRepository systemConfigRepository,
                         AiClient aiClient) {
        this.animalRepository = animalRepository;
        this.weightRecordRepository = weightRecordRepository;
        this.aiAlertRepository = aiAlertRepository;
        this.systemConfigRepository = systemConfigRepository;
        this.aiClient = aiClient;
    }

    public PagedResponse<AnimalResponse> findAll(String search, String breed, String status, int page, int size, String sortBy, String direction) {
        Sort sort = Sort.by("desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Animal> specification = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Multi-tenancy filter
            UUID farmId = SecurityUtils.getCurrentFarmId();
            if (farmId != null) {
                predicates.add(cb.equal(root.get("farmId"), farmId));
            }

            if (search != null && !search.isBlank()) {
                String likeValue = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("tagNumber")), likeValue),
                        cb.like(cb.lower(root.get("name")), likeValue)
                ));
            }
            if (breed != null && !breed.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("breed")), breed.toLowerCase()));
            }
            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(root.get("status"), Enum.valueOf(com.moomoo.common.AnimalStatus.class, status.toUpperCase())));
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };
        Page<AnimalResponse> results = animalRepository.findAll(specification, pageable).map(this::toResponse);
        return PagedResponse.from(results);
    }

    public AnimalResponse create(AnimalRequest request) {
        Animal animal = new Animal();
        apply(animal, request);
        return toResponse(animalRepository.save(animal));
    }

    public AnimalResponse get(UUID id) {
        return toResponse(getEntity(id));
    }

    public AnimalResponse update(UUID id, AnimalRequest request) {
        Animal animal = getEntity(id);
        apply(animal, request);
        return toResponse(animalRepository.save(animal));
    }

    public AnimalResponse softDelete(UUID id) {
        Animal animal = getEntity(id);
        animal.setStatus(com.moomoo.common.AnimalStatus.CULLED);
        return toResponse(animalRepository.save(animal));
    }

    public WeightRecordResponse addWeight(UUID animalId, WeightRecordRequest request) {
        Animal animal = getEntity(animalId);
        WeightRecord record = new WeightRecord();
        record.setAnimal(animal);
        record.setRecordedDate(request.recordedDate());
        record.setWeightKg(request.weightKg());
        record.setRecordedBy(request.recordedBy());
        WeightRecord saved = weightRecordRepository.save(record);

        int threshold = systemConfigRepository.findAll().stream()
                .findFirst()
                .map(SystemConfig::getWeightTriggerThreshold)
                .orElse(30);
        BigDecimal baselineWeight = BigDecimal.valueOf(400);
        if (request.weightKg().compareTo(baselineWeight.subtract(BigDecimal.valueOf(threshold))) < 0) {
            AiAlert alert = new AiAlert();
            alert.setAnimal(animal);
            alert.setAlertType(AlertType.WEIGHT);
            alert.setSeverity(AlertSeverity.HIGH);
            alert.setMessage("Weight is below configured threshold");
            alert.setRecommendedAction("Review feed plan and trigger feed agent recalculation");
            alert.setCreatedAt(Instant.now());
            aiAlertRepository.save(alert);
        }

        return toResponse(saved);
    }

    public List<WeightRecordResponse> weightHistory(UUID animalId) {
        return weightRecordRepository.findByAnimalIdOrderByRecordedDateDesc(animalId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public Map<String, Object> aiInsights(UUID animalId) {
        getEntity(animalId);
        return aiClient.getAnimalInsights(animalId);
    }

    private Animal getEntity(UUID id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + id));
        
        UUID currentFarmId = SecurityUtils.getCurrentFarmId();
        if (currentFarmId != null && !currentFarmId.equals(animal.getFarmId())) {
            throw new ResourceNotFoundException("Animal not found: " + id);
        }
        return animal;
    }

    private void apply(Animal animal, AnimalRequest request) {
        animal.setTagNumber(request.tagNumber());
        animal.setName(request.name());
        animal.setBreed(request.breed());
        animal.setDateOfBirth(request.dateOfBirth());
        animal.setPurchaseDate(request.purchaseDate());
        animal.setPurchasePrice(request.purchasePrice());
        animal.setStatus(request.status());
        animal.setNotes(request.notes());
        if (animal.getFarmId() == null) {
            animal.setFarmId(SecurityUtils.getCurrentFarmId());
        }
    }

    private AnimalResponse toResponse(Animal animal) {
        return new AnimalResponse(
                animal.getId(),
                animal.getTagNumber(),
                animal.getName(),
                animal.getBreed(),
                animal.getDateOfBirth(),
                animal.getPurchaseDate(),
                animal.getPurchasePrice(),
                animal.getStatus(),
                animal.getNotes()
        );
    }

    private WeightRecordResponse toResponse(WeightRecord record) {
        return new WeightRecordResponse(record.getId(), record.getRecordedDate(), record.getWeightKg(), record.getRecordedBy());
    }
}
