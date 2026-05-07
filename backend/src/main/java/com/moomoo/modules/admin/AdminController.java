package com.moomoo.modules.admin;

import com.moomoo.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final SystemConfigRepository systemConfigRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(UserRepository userRepository,
                           SystemConfigRepository systemConfigRepository,
                           AuditLogRepository auditLogRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.systemConfigRepository = systemConfigRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/users")
    public List<UserResponse> users() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    @PostMapping("/users")
    public UserResponse createUser(@Valid @RequestBody UserCreateRequest request) {
        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(request.role());
        user.setActive(true);
        return toResponse(userRepository.save(user));
    }

    @PutMapping("/users/{id}")
    public UserResponse updateUser(@PathVariable UUID id, @Valid @RequestBody UserUpdateRequest payload) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        user.setName(payload.name());
        user.setEmail(payload.email());
        user.setRole(payload.role());
        user.setActive(payload.active());
        if (payload.password() != null && !payload.password().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(payload.password()));
        }
        return toResponse(userRepository.save(user));
    }

    @GetMapping("/audit-logs")
    public List<AuditLog> auditLogs() {
        return auditLogRepository.findAll();
    }

    @GetMapping("/config")
    public SystemConfig config() {
        return systemConfigRepository.findAll().stream().findFirst().orElseGet(SystemConfig::new);
    }

    @PutMapping("/config")
    public SystemConfig updateConfig(@RequestBody SystemConfig payload) {
        SystemConfig config = systemConfigRepository.findAll().stream().findFirst().orElseGet(SystemConfig::new);
        config.setFarmName(payload.getFarmName());
        config.setCurrency(payload.getCurrency());
        config.setDefaultLanguage(payload.getDefaultLanguage());
        config.setSccThreshold(payload.getSccThreshold());
        config.setWeightTriggerThreshold(payload.getWeightTriggerThreshold());
        config.setAiServiceUrl(payload.getAiServiceUrl());
        return systemConfigRepository.save(config);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.isActive(), user.getLastLogin());
    }
}
