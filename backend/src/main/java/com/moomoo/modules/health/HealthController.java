package com.moomoo.modules.health;

import com.moomoo.common.PagedResponse;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    private final HealthService healthService;

    public HealthController(HealthService healthService) {
        this.healthService = healthService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER','MANAGER','ENTRY')")
    @GetMapping("/api/vaccinations")
    public List<Vaccination> vaccinations() {
        return healthService.vaccinations();
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','ENTRY')")
    @PostMapping("/api/vaccinations")
    public Vaccination addVaccination(@RequestParam UUID animalId, @RequestBody Vaccination vaccination) {
        return healthService.addVaccination(animalId, vaccination);
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER','MANAGER','ENTRY')")
    @GetMapping("/api/disease-records")
    public List<DiseaseRecord> diseaseRecords() {
        return healthService.diseaseRecords();
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','ENTRY')")
    @PostMapping("/api/disease-records")
    public DiseaseRecord addDiseaseRecord(@RequestParam UUID animalId, @RequestBody DiseaseRecord record) {
        return healthService.addDiseaseRecord(animalId, record);
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER','MANAGER','ENTRY')")
    @GetMapping("/api/ai-alerts")
    public PagedResponse<AiAlertResponse> alerts(
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean reviewed,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return healthService.alerts(severity, type, reviewed, page, size);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PutMapping("/api/ai-alerts/{id}/review")
    public AiAlertResponse review(@PathVariable UUID id, @RequestParam(defaultValue = "manager") String reviewedBy) {
        return healthService.reviewAlert(id, reviewedBy);
    }
}
