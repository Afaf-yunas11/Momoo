package com.moomoo.modules.animal;

import com.moomoo.common.PagedResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/animals")
public class AnimalController {

    private final AnimalService animalService;

    public AnimalController(AnimalService animalService) {
        this.animalService = animalService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER','MANAGER','ENTRY')")
    @GetMapping
    public PagedResponse<AnimalResponse> findAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        return animalService.findAll(search, breed, status, page, size, sortBy, direction);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PostMapping
    public AnimalResponse create(@Valid @RequestBody AnimalRequest animal) {
        return animalService.create(animal);
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER','MANAGER','ENTRY')")
    @GetMapping("/{id}")
    public AnimalResponse get(@PathVariable UUID id) {
        return animalService.get(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PutMapping("/{id}")
    public AnimalResponse update(@PathVariable UUID id, @Valid @RequestBody AnimalRequest animal) {
        return animalService.update(id, animal);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @DeleteMapping("/{id}")
    public AnimalResponse softDelete(@PathVariable UUID id) {
        return animalService.softDelete(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','ENTRY')")
    @PostMapping("/{id}/weights")
    public WeightRecordResponse addWeight(@PathVariable UUID id, @Valid @RequestBody WeightRecordRequest request) {
        return animalService.addWeight(id, request);
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER','MANAGER','ENTRY')")
    @GetMapping("/{id}/weights")
    public List<WeightRecordResponse> weightHistory(@PathVariable UUID id) {
        return animalService.weightHistory(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER','MANAGER','ENTRY')")
    @GetMapping("/{id}/ai-insights")
    public Map<String, Object> aiInsights(@PathVariable UUID id) {
        return animalService.aiInsights(id);
    }
}
