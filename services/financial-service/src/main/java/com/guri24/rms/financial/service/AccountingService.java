package com.guri24.rms.financial.service;

import com.guri24.rms.financial.domain.enums.EntryStatus;
import com.guri24.rms.financial.domain.model.JournalEntry;
import com.guri24.rms.financial.domain.model.JournalLine;
import com.guri24.rms.financial.domain.model.PropertyExpense;
import com.guri24.rms.financial.repository.JournalEntryRepository;
import com.guri24.rms.financial.repository.PropertyExpenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountingService {

    private final JournalEntryRepository journalEntryRepository;
    private final PropertyExpenseRepository propertyExpenseRepository;

    @Transactional
    public JournalEntry postJournalEntry(JournalEntry entry) {
        // 1. Double-Entry Balance Invariant: SUM(Debits) == SUM(Credits)
        if (entry.getTotalDebitKes() == null || entry.getTotalCreditKes() == null) {
            throw new IllegalArgumentException("Accounting Invariant Violation: Total debit and credit amounts are required");
        }
        if (entry.getTotalDebitKes().compareTo(entry.getTotalCreditKes()) != 0) {
            throw new IllegalStateException(String.format(
                "Accounting Invariant Violation: Journal is unbalanced! Debits KES %s != Credits KES %s",
                entry.getTotalDebitKes(), entry.getTotalCreditKes()
            ));
        }

        // 2. Validate line totals match entry header
        BigDecimal lineDebits = BigDecimal.ZERO;
        BigDecimal lineCredits = BigDecimal.ZERO;
        for (JournalLine line : entry.getLines()) {
            lineDebits = lineDebits.add(line.getDebitKes() != null ? line.getDebitKes() : BigDecimal.ZERO);
            lineCredits = lineCredits.add(line.getCreditKes() != null ? line.getCreditKes() : BigDecimal.ZERO);
            line.setJournalEntry(entry);
            line.setOrganizationId(entry.getOrganizationId());
        }

        if (lineDebits.compareTo(entry.getTotalDebitKes()) != 0 || lineCredits.compareTo(entry.getTotalCreditKes()) != 0) {
            throw new IllegalStateException("Accounting Invariant Violation: Sum of line debits/credits does not match entry total");
        }

        entry.setStatus(EntryStatus.POSTED);
        JournalEntry saved = journalEntryRepository.save(entry);
        log.info("Posted immutable double-entry journal entry {} for org {}", saved.getEntryNumber(), saved.getOrganizationId());
        return saved;
    }

    @Transactional
    public JournalEntry reverseJournalEntry(UUID orgId, UUID entryId, String reversalReason) {
        JournalEntry original = journalEntryRepository.findById(entryId)
            .filter(e -> e.getOrganizationId().equals(orgId))
            .orElseThrow(() -> new IllegalArgumentException("Journal entry not found for organization: " + entryId));

        if (original.getStatus() == EntryStatus.REVERSED) {
            throw new IllegalStateException("Journal entry is already reversed: " + entryId);
        }

        // Create balanced reversal entry with inverted debits and credits
        JournalEntry reversal = JournalEntry.builder()
            .organizationId(orgId)
            .propertyId(original.getPropertyId())
            .entryNumber("REV-" + original.getEntryNumber())
            .entryDate(LocalDate.now())
            .sourceEventType("REVERSAL")
            .sourceEntityId(original.getId())
            .description(String.format("Reversal of %s: %s", original.getEntryNumber(), reversalReason))
            .status(EntryStatus.POSTED)
            .reversalOfEntryId(original.getId())
            .totalDebitKes(original.getTotalCreditKes())
            .totalCreditKes(original.getTotalDebitKes())
            .currency(original.getCurrency())
            .postedBy(original.getPostedBy())
            .build();

        for (JournalLine origLine : original.getLines()) {
            JournalLine revLine = JournalLine.builder()
                .organizationId(orgId)
                .accountId(origLine.getAccountId())
                .tenantId(origLine.getTenantId())
                .leaseId(origLine.getLeaseId())
                .debitKes(origLine.getCreditKes()) // Swap debit & credit
                .creditKes(origLine.getDebitKes())
                .memo("Reversal: " + (origLine.getMemo() != null ? origLine.getMemo() : ""))
                .build();
            reversal.addLine(revLine);
        }

        original.setStatus(EntryStatus.REVERSED);
        journalEntryRepository.save(original);
        JournalEntry savedReversal = journalEntryRepository.save(reversal);

        log.info("Reversed journal entry {} via new balancing reversal entry {}", original.getEntryNumber(), savedReversal.getEntryNumber());
        return savedReversal;
    }

    public List<JournalEntry> listJournalEntries(UUID orgId) {
        return journalEntryRepository.findByOrganizationIdOrderByEntryDateDesc(orgId);
    }

    @Transactional
    public PropertyExpense recordExpense(PropertyExpense expense) {
        if (expense.getAmountKes() == null || expense.getAmountKes().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Expense amount must be strictly greater than zero");
        }
        return propertyExpenseRepository.save(expense);
    }

    public List<PropertyExpense> listExpenses(UUID orgId) {
        return propertyExpenseRepository.findByOrganizationIdOrderByExpenseDateDesc(orgId);
    }
}
