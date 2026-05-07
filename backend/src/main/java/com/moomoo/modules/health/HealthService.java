package com.moomoo.modules.health;

import com.moomoo.common.PagedResponse;
import com.moomoo.exception.ResourceNotFoundException;
import com.moomoo.modules.animal.AnimalRepository;
import jakarta.persistence.criteria.Predicate;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class HealthService {

    private final VaccinationRepository vaccinationRepository;
    private final DiseaseRecordRepository diseaseRecordRepository;
    private final AiAlertRepository aiAlertRepository;
    private final AnimalRepository animalRepository;

    public HealthService(VaccinationRepository vaccinationRepository, DiseaseRecordRepository diseaseRecordRepository,
                         AiAlertRepository aiAlertRepository, AnimalRepository animalRepository) {
        this.vaccinationRepository = vaccinationRepository;
        this.diseaseRecordRepository = diseaseRecordRepository;
        this.aiAlertRepository = aiAlertRepository;
        this.animalRepository = animalRepository;
    }

    public List<Vaccination> vaccinations() {
        return vaccinationRepository.findAll();
    }

    public Vaccination addVaccination(UUID animalId, Vaccination vaccination) {
        vaccination.setAnimal(animalRepository.findById(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + animalId)));
        return vaccinationRepository.save(vaccination);
    }

    public List<DiseaseRecord> diseaseRecords() {
        return diseaseRecordRepository.findAll();
    }

    public DiseaseRecord addDiseaseRecord(UUID animalId, DiseaseRecord record) {
        record.setAnimal(animalRepository.findById(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + animalId)));
        return diseaseRecordRepository.save(record);
    }

    public PagedResponse<AiAlertResponse> alerts(String severity, String type, Boolean reviewed, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Specification<AiAlert> specification = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (severity != null && !severity.isBlank()) {
                predicates.add(cb.equal(root.get("severity"), Enum.valueOf(com.moomoo.common.AlertSeverity.class, severity.toUpperCase())));
            }
            if (type != null && !type.isBlank()) {
                predicates.add(cb.equal(root.get("alertType"), Enum.valueOf(com.moomoo.common.AlertType.class, type.toUpperCase())));
            }
            if (reviewed != null) {
                predicates.add(reviewed ? cb.isNotNull(root.get("reviewedAt")) : cb.isNull(root.get("reviewedAt")));
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };
        Page<AiAlertResponse> results = aiAlertRepository.findAll(specification, pageable).map(this::toResponse);
        return PagedResponse.from(results);
    }

    public AiAlertResponse reviewAlert(UUID id, String reviewedBy) {
        AiAlert alert = aiAlertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found: " + id));
        alert.setReviewedAt(Instant.now());
        alert.setReviewedBy(reviewedBy);
        return toResponse(aiAlertRepository.save(alert));
    }

    private AiAlertResponse toResponse(AiAlert alert) {
        return new AiAlertResponse(
                alert.getId(),
                alert.getAnimal() == null ? null : alert.getAnimal().getId(),
                alert.getAnimal() == null ? null : alert.getAnimal().getTagNumber(),
                alert.getAlertType(),
                alert.getSeverity(),
                alert.getMessage(),
                alert.getRecommendedAction(),
                alert.getCreatedAt(),
                alert.getReviewedAt(),
                alert.getReviewedBy()
        );
    }
}
