package com.moomoo.modules.environment;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/environment")
public class EnvironmentController {

    private final EnvironmentService environmentService;

    public EnvironmentController(EnvironmentService environmentService) {
        this.environmentService = environmentService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','ENTRY')")
    @GetMapping
    public List<EnvironmentLog> findAll() {
        return environmentService.findAll();
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','ENTRY')")
    @PostMapping
    public EnvironmentLog create(@RequestBody EnvironmentLog log) {
        return environmentService.create(log);
    }
}
