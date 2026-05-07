package com.moomoo.modules.reports;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportArchiveRepository extends JpaRepository<ReportArchive, UUID> {
}
