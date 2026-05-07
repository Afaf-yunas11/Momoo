package com.moomoo.modules.reports;

import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER','MANAGER')")
    @PostMapping("/generate")
    public ReportArchive generate(@RequestBody ReportArchive request) {
        return reportService.generate(request);
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER','MANAGER')")
    @GetMapping
    public List<ReportArchive> findAll() {
        return reportService.findAll();
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER','MANAGER')")
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable UUID id) {
        byte[] pdfBytes = reportService.generatePdfBytes(id);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
