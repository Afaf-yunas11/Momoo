package com.moomoo.modules.milk;

import com.moomoo.common.AlertSeverity;
import com.moomoo.common.AlertType;
import com.moomoo.common.PagedResponse;
import com.moomoo.common.SecurityUtils;
import com.moomoo.exception.ResourceNotFoundException;
import com.moomoo.modules.admin.SystemConfig;
import com.moomoo.modules.admin.SystemConfigRepository;
import com.moomoo.modules.animal.Animal;
import com.moomoo.modules.animal.AnimalRepository;
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
public class MilkRecordService {

    private final MilkRecordRepository milkRecordRepository;
    private final AnimalRepository animalRepository;
    private final AiAlertRepository aiAlertRepository;
    private final SystemConfigRepository systemConfigRepository;

    public MilkRecordService(MilkRecordRepository milkRecordRepository,
                             AnimalRepository animalRepository,
                             AiAlertRepository aiAlertRepository,
                             SystemConfigRepository systemConfigRepository) {
        this.milkRecordRepository = milkRecordRepository;
        this.animalRepository = animalRepository;
        this.aiAlertRepository = aiAlertRepository;
        this.systemConfigRepository = systemConfigRepository;
    }

    public PagedResponse<MilkRecordResponse> findAll(UUID animalId, String dateFrom, String dateTo, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "recordDate"));
        Specification<MilkRecord> specification = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            UUID farmId = SecurityUtils.getCurrentFarmId();
            if (farmId != null) {
                predicates.add(cb.equal(root.get("farmId"), farmId));
            }

            if (animalId != null) {
                predicates.add(cb.equal(root.get("animal").get("id"), animalId));
            }
            if (dateFrom != null && !dateFrom.isBlank()) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("recordDate"), java.time.LocalDate.parse(dateFrom)));
            }
            if (dateTo != null && !dateTo.isBlank()) {
                predicates.add(cb.lessThanOrEqualTo(root.get("recordDate"), java.time.LocalDate.parse(dateTo)));
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };
        Page<MilkRecordResponse> result = milkRecordRepository.findAll(specification, pageable).map(this::toResponse);
        return PagedResponse.from(result);
    }

    public MilkRecordResponse create(MilkRecordRequest request) {
        Animal animal = animalRepository.findById(request.animalId())
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + request.animalId()));
        MilkRecord record = new MilkRecord();
        record.setAnimal(animal);
        record.setFarmId(SecurityUtils.getCurrentFarmId());
        record.setRecordDate(request.recordDate());
        record.setSession(request.session());
        record.setMorningYield(request.morningYield());
        record.setEveningYield(request.eveningYield());
        record.setFatPct(request.fatPct());
        record.setProteinPct(request.proteinPct());
        record.setScc(request.scc());
        record.setBacterialLoad(request.bacterialLoad());
        record.setMachineUsed(request.machineUsed());
        BigDecimal morning = request.morningYield() == null ? BigDecimal.ZERO : request.morningYield();
        BigDecimal evening = request.eveningYield() == null ? BigDecimal.ZERO : request.eveningYield();
        record.setTotalYield(morning.add(evening));

        MilkRecord saved = milkRecordRepository.save(record);

        long sccThreshold = systemConfigRepository.findAll().stream()
                .findFirst()
                .map(SystemConfig::getSccThreshold)
                .orElse(200_000L);
        if (saved.getScc() != null && saved.getScc() > sccThreshold) {
            AiAlert alert = new AiAlert();
            alert.setAnimal(animal);
            alert.setAlertType(AlertType.HEALTH);
            alert.setSeverity(AlertSeverity.HIGH);
            alert.setMessage("SCC threshold exceeded");
            alert.setRecommendedAction("Trigger health review and AI mastitis screening");
            alert.setCreatedAt(Instant.now());
            aiAlertRepository.save(alert);
        }
        return toResponse(saved);
    }

    public Map<String, Object> summary() {
        UUID farmId = SecurityUtils.getCurrentFarmId();
        List<MilkRecord> records = milkRecordRepository.findAll().stream()
                .filter(r -> farmId == null || farmId.equals(r.getFarmId()))
                .toList();
                
        BigDecimal total = records.stream()
                .map(MilkRecord::getTotalYield)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return Map.of("totalYieldLitres", total, "recordCount", (long) records.size());
    }

    public List<MilkRecordResponse> trends(UUID animalId) {
        return milkRecordRepository.findByAnimalIdOrderByRecordDateDesc(animalId).stream()
                .map(this::toResponse)
                .toList();
    }

    private MilkRecordResponse toResponse(MilkRecord record) {
        return new MilkRecordResponse(
                record.getId(),
                record.getAnimal().getId(),
                record.getAnimal().getTagNumber(),
                record.getRecordDate(),
                record.getSession(),
                record.getMorningYield(),
                record.getEveningYield(),
                record.getTotalYield(),
                record.getFatPct(),
                record.getProteinPct(),
                record.getScc(),
                record.getBacterialLoad(),
                record.getMachineUsed()
        );
    }
}
