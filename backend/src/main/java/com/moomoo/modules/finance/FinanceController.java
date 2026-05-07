package com.moomoo.modules.finance;

import com.moomoo.common.PagedResponse;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FinanceController {

    private final FinanceService financeService;

    public FinanceController(FinanceService financeService) {
        this.financeService = financeService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER','MANAGER')")
    @GetMapping("/api/revenue")
    public PagedResponse<RevenueRecordResponse> revenue(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return financeService.revenue(category, dateFrom, dateTo, page, size);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PostMapping("/api/revenue")
    public RevenueRecordResponse addRevenue(@Valid @RequestBody RevenueRecordRequest record) {
        return financeService.addRevenue(record);
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER','MANAGER')")
    @GetMapping("/api/expenses")
    public PagedResponse<ExpenseRecordResponse> expenses(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return financeService.expenses(category, dateFrom, dateTo, page, size);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PostMapping("/api/expenses")
    public ExpenseRecordResponse addExpense(@Valid @RequestBody ExpenseRecordRequest record) {
        return financeService.addExpense(record);
    }

    @PreAuthorize("hasAnyRole('ADMIN','OWNER','MANAGER')")
    @GetMapping("/api/finance/profit-summary")
    public Map<String, Object> profitSummary() {
        return financeService.profitSummary();
    }
}
