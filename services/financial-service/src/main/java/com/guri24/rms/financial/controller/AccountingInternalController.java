package com.guri24.rms.financial.controller;

import com.guri24.rms.financial.config.TenantContextHolder;
import com.guri24.rms.financial.domain.model.JournalEntry;
import com.guri24.rms.financial.domain.model.PropertyExpense;
import com.guri24.rms.financial.service.AccountingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/internal/accounting")
@RequiredArgsConstructor
public class AccountingInternalController {

    private final AccountingService accountingService;

    @GetMapping("/journals")
    public ResponseEntity<List<JournalEntry>> listJournals(@RequestHeader(value = "X-Organization-Id", required = false) UUID headerOrgId) {
        UUID orgId = resolveOrgId(headerOrgId);
        return ResponseEntity.ok(accountingService.listJournalEntries(orgId));
    }

    @PostMapping("/journals")
    public ResponseEntity<JournalEntry> postJournal(@RequestHeader(value = "X-Organization-Id", required = false) UUID headerOrgId,
                                                   @RequestBody JournalEntry entry) {
        UUID orgId = resolveOrgId(headerOrgId);
        entry.setOrganizationId(orgId);
        return ResponseEntity.ok(accountingService.postJournalEntry(entry));
    }

    @PostMapping("/journals/{id}/reverse")
    public ResponseEntity<JournalEntry> reverseJournal(@RequestHeader(value = "X-Organization-Id", required = false) UUID headerOrgId,
                                                      @PathVariable("id") UUID id,
                                                      @RequestBody Map<String, String> payload) {
        UUID orgId = resolveOrgId(headerOrgId);
        String reason = payload.getOrDefault("reason", "Administrative correction");
        return ResponseEntity.ok(accountingService.reverseJournalEntry(orgId, id, reason));
    }

    @GetMapping("/expenses")
    public ResponseEntity<List<PropertyExpense>> listExpenses(@RequestHeader(value = "X-Organization-Id", required = false) UUID headerOrgId) {
        UUID orgId = resolveOrgId(headerOrgId);
        return ResponseEntity.ok(accountingService.listExpenses(orgId));
    }

    @PostMapping("/expenses")
    public ResponseEntity<PropertyExpense> recordExpense(@RequestHeader(value = "X-Organization-Id", required = false) UUID headerOrgId,
                                                         @RequestBody PropertyExpense expense) {
        UUID orgId = resolveOrgId(headerOrgId);
        expense.setOrganizationId(orgId);
        return ResponseEntity.ok(accountingService.recordExpense(expense));
    }

    private UUID resolveOrgId(UUID headerOrgId) {
        UUID contextId = TenantContextHolder.getOrganizationId();
        if (contextId != null) return contextId;
        if (headerOrgId != null) return headerOrgId;
        throw new IllegalArgumentException("Organization ID must be provided via X-Organization-Id header");
    }
}
