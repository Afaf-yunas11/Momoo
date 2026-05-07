package com.moomoo.modules.health;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VaccinationRepository extends JpaRepository<Vaccination, UUID> {
}
