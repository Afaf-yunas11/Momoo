package com.moomoo.modules.reports;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.moomoo.common.SecurityUtils;
import com.moomoo.exception.ResourceNotFoundException;
import java.io.ByteArrayOutputStream;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class ReportService {

    private final ReportArchiveRepository reportArchiveRepository;

    public ReportService(ReportArchiveRepository reportArchiveRepository) {
        this.reportArchiveRepository = reportArchiveRepository;
    }

    public ReportArchive generate(ReportArchive request) {
        request.setGeneratedAt(Instant.now());
        request.setTitle("System Generated " + request.getReportType());
        request.setFarmId(SecurityUtils.getCurrentFarmId());
        request.setFilePath("/tmp/" + request.getReportType() + "_" + UUID.randomUUID() + ".pdf");
        return reportArchiveRepository.save(request);
    }

    public byte[] generatePdfBytes(UUID reportId) {
        ReportArchive report = reportArchiveRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        UUID currentFarmId = SecurityUtils.getCurrentFarmId();
        if (currentFarmId != null && !currentFarmId.equals(report.getFarmId())) {
            throw new ResourceNotFoundException("Report not found");
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, baos);

        document.open();
        Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
        document.add(new Paragraph("mOOMOO Smart Dairy Report", titleFont));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Report Type: " + report.getReportType()));
        document.add(new Paragraph("Generated At: " + report.getGeneratedAt()));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("This is a system-generated report for your farm."));
        document.add(new Paragraph("Detailed analytics and herd performance data included."));
        document.close();

        return baos.toByteArray();
    }

    public List<ReportArchive> findAll() {
        UUID farmId = SecurityUtils.getCurrentFarmId();
        return reportArchiveRepository.findAll().stream()
                .filter(r -> farmId == null || farmId.equals(r.getFarmId()))
                .toList();
    }
}
