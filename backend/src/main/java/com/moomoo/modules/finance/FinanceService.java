package com.moomoo.modules.finance;

import com.moomoo.common.PagedResponse;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import com.moomoo.common.SecurityUtils;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class FinanceService {

    private final RevenueRecordRepository revenueRecordRepository;
    private final ExpenseRecordRepository expenseRecordRepository;

    public FinanceService(RevenueRecordRepository revenueRecordRepository, ExpenseRecordRepository expenseRecordRepository) {
        this.revenueRecordRepository = revenueRecordRepository;
        this.expenseRecordRepository = expenseRecordRepository;
    }

    public PagedResponse<RevenueRecordResponse> revenue(String category, String dateFrom, String dateTo, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "recordDate"));
        Specification<RevenueRecord> specification = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            UUID farmId = SecurityUtils.getCurrentFarmId();
            if (farmId != null) {
                predicates.add(cb.equal(root.get("farmId"), farmId));
            }
            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(root.get("category"), Enum.valueOf(com.moomoo.common.RevenueCategory.class, category.toUpperCase())));
            }
            if (dateFrom != null && !dateFrom.isBlank()) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("recordDate"), LocalDate.parse(dateFrom)));
            }
            if (dateTo != null && !dateTo.isBlank()) {
                predicates.add(cb.lessThanOrEqualTo(root.get("recordDate"), LocalDate.parse(dateTo)));
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };
        Page<RevenueRecordResponse> results = revenueRecordRepository.findAll(specification, pageable).map(this::toResponse);
        return PagedResponse.from(results);
    }

    public RevenueRecordResponse addRevenue(RevenueRecordRequest request) {
        RevenueRecord record = new RevenueRecord();
        record.setFarmId(SecurityUtils.getCurrentFarmId());
        record.setRecordDate(request.recordDate());
        record.setCategory(request.category());
        record.setAmountPkr(request.amountPkr());
        record.setBuyerName(request.buyerName());
        record.setQuantity(request.quantity());
        record.setRatePerUnit(request.ratePerUnit());
        record.setNotes(request.notes());
        return toResponse(revenueRecordRepository.save(record));
    }

    public PagedResponse<ExpenseRecordResponse> expenses(String category, String dateFrom, String dateTo, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "recordDate"));
        Specification<ExpenseRecord> specification = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            UUID farmId = SecurityUtils.getCurrentFarmId();
            if (farmId != null) {
                predicates.add(cb.equal(root.get("farmId"), farmId));
            }
            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(root.get("category"), Enum.valueOf(com.moomoo.common.ExpenseCategory.class, category.toUpperCase())));
            }
            if (dateFrom != null && !dateFrom.isBlank()) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("recordDate"), LocalDate.parse(dateFrom)));
            }
            if (dateTo != null && !dateTo.isBlank()) {
                predicates.add(cb.lessThanOrEqualTo(root.get("recordDate"), LocalDate.parse(dateTo)));
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };
        Page<ExpenseRecordResponse> results = expenseRecordRepository.findAll(specification, pageable).map(this::toExpenseResponse);
        return PagedResponse.from(results);
    }

    public ExpenseRecordResponse addExpense(ExpenseRecordRequest request) {
        ExpenseRecord record = new ExpenseRecord();
        record.setFarmId(SecurityUtils.getCurrentFarmId());
        record.setRecordDate(request.recordDate());
        record.setCategory(request.category());
        record.setAmountPkr(request.amountPkr());
        record.setVendor(request.vendor());
        record.setInvoiceNumber(request.invoiceNumber());
        record.setNotes(request.notes());
        return toExpenseResponse(expenseRecordRepository.save(record));
    }

    public Map<String, Object> profitSummary() {
        UUID farmId = SecurityUtils.getCurrentFarmId();
        BigDecimal revenue = revenueRecordRepository.findAll().stream()
                .filter(r -> farmId == null || farmId.equals(r.getFarmId()))
                .map(RevenueRecord::getAmountPkr)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal expenses = expenseRecordRepository.findAll().stream()
                .filter(e -> farmId == null || farmId.equals(e.getFarmId()))
                .map(ExpenseRecord::getAmountPkr)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return Map.of("totalRevenue", revenue, "totalExpenses", expenses, "netProfit", revenue.subtract(expenses));
    }

    private RevenueRecordResponse toResponse(RevenueRecord record) {
        return new RevenueRecordResponse(record.getId(), record.getRecordDate(), record.getCategory(), record.getAmountPkr(),
                record.getBuyerName(), record.getQuantity(), record.getRatePerUnit(), record.getNotes());
    }

    private ExpenseRecordResponse toExpenseResponse(ExpenseRecord record) {
        return new ExpenseRecordResponse(record.getId(), record.getRecordDate(), record.getCategory(), record.getAmountPkr(),
                record.getVendor(), record.getInvoiceNumber(), record.getNotes());
    }
}
