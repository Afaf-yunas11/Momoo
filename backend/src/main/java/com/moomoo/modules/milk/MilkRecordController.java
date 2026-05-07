package com.moomoo.modules.milk;

import com.moomoo.common.PagedResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/milk-records")
public class MilkRecordController {

    private final MilkRecordService milkRecordService;

    public MilkRecordController(MilkRecordService milkRecordService) {
        this.milkRecordService = milkRecordService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER','MANAGER','ENTRY')")
    @GetMapping
    public PagedResponse<MilkRecordResponse> findAll(
            @RequestParam(required = false) UUID animalId,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return milkRecordService.findAll(animalId, dateFrom, dateTo, page, size);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','ENTRY')")
    @PostMapping
    public MilkRecordResponse create(@Valid @RequestBody MilkRecordRequest request) {
        return milkRecordService.create(request);
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER','MANAGER','ENTRY')")
    @GetMapping("/summary")
    public Map<String, Object> summary() {
        return milkRecordService.summary();
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER','MANAGER','ENTRY')")
    @GetMapping("/trends/{animalId}")
    public List<MilkRecordResponse> trends(@PathVariable UUID animalId) {
        return milkRecordService.trends(animalId);
    }
}
