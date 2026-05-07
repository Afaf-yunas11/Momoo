package com.moomoo.modules.reproduction;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
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
public class ReproductionController {

    private final ReproductionService reproductionService;

    public ReproductionController(ReproductionService reproductionService) {
        this.reproductionService = reproductionService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER','MANAGER')")
    @GetMapping("/api/breeding-records")
    public List<BreedingRecord> breedingRecords() {
        return reproductionService.breedingRecords();
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PostMapping("/api/breeding-records")
    public BreedingRecord addBreedingRecord(@RequestParam UUID animalId, @RequestBody BreedingRecord record) {
        return reproductionService.addBreedingRecord(animalId, record);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PutMapping("/api/breeding-records/{id}/confirm-pregnancy")
    public BreedingRecord confirmPregnancy(@PathVariable UUID id,
                                           @RequestParam(required = false) LocalDate confirmationDate) {
        return reproductionService.confirmPregnancy(id, confirmationDate == null ? LocalDate.now() : confirmationDate);
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER','MANAGER')")
    @GetMapping("/api/calving-records")
    public List<CalvingRecord> calvingRecords() {
        return reproductionService.calvingRecords();
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PostMapping("/api/calving-records")
    public CalvingRecord addCalvingRecord(@RequestParam UUID animalId, @RequestBody CalvingRecord record) {
        return reproductionService.addCalvingRecord(animalId, record);
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER','MANAGER')")
    @GetMapping("/api/reproduction/herd-summary")
    public Map<String, Object> herdSummary() {
        return reproductionService.herdSummary();
    }
}
