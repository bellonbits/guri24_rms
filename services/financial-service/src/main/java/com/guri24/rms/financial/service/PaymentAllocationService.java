package com.guri24.rms.financial.service;

import com.guri24.rms.financial.domain.model.Invoice;
import com.guri24.rms.financial.domain.model.Payment;
import com.guri24.rms.financial.domain.model.PaymentAllocation;
import com.guri24.rms.financial.repository.InvoiceRepository;
import com.guri24.rms.financial.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentAllocationService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;

    /**
     * Executes FIFO (Oldest First) Payment Allocation across open invoices
     */
    @Transactional
    public List<PaymentAllocation> allocatePaymentFifo(UUID orgId, UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
            .filter(p -> p.getOrganizationId().equals(orgId))
            .orElseThrow(() -> new IllegalArgumentException("Payment not found for org: " + paymentId));

        if (payment.getAmountKes() == null || payment.getAmountKes().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalStateException("Payment amount must be positive");
        }

        // Fetch unpaid invoices for the tenant, ordered by due date ascending (oldest first)
        List<Invoice> openInvoices = invoiceRepository.findUnpaidInvoicesForTenantFifo(orgId, payment.getTenantId());

        BigDecimal unallocatedRemaining = payment.getAmountKes().subtract(
            payment.getAllocatedAmountKes() != null ? payment.getAllocatedAmountKes() : BigDecimal.ZERO
        );

        List<PaymentAllocation> newAllocations = new ArrayList<>();

        for (Invoice invoice : openInvoices) {
            if (unallocatedRemaining.compareTo(BigDecimal.ZERO) <= 0) {
                break;
            }

            BigDecimal invoiceBalance = invoice.getBalanceKes();
            if (invoiceBalance == null || invoiceBalance.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            // Allocation amount is min(unallocatedRemaining, invoiceBalance)
            BigDecimal allocationAmount = unallocatedRemaining.min(invoiceBalance);

            PaymentAllocation allocation = PaymentAllocation.builder()
                .organizationId(orgId)
                .payment(payment)
                .invoiceId(invoice.getId())
                .allocatedAmountKes(allocationAmount)
                .allocationStrategy("FIFO_OLDEST_FIRST")
                .isReversed(false)
                .build();

            newAllocations.add(allocation);
            payment.addAllocation(allocation);

            // Update invoice balances
            BigDecimal newPaid = (invoice.getAmountPaidKes() != null ? invoice.getAmountPaidKes() : BigDecimal.ZERO).add(allocationAmount);
            invoice.setAmountPaidKes(newPaid);
            invoice.recalculateBalance();
            invoiceRepository.save(invoice);

            unallocatedRemaining = unallocatedRemaining.subtract(allocationAmount);
        }

        BigDecimal totalAllocated = payment.getAmountKes().subtract(unallocatedRemaining);
        payment.setAllocatedAmountKes(totalAllocated);
        payment.setUnallocatedAmountKes(unallocatedRemaining);
        paymentRepository.save(payment);

        log.info("Allocated payment {} across {} invoice(s). Total allocated: KES {}, Unallocated: KES {}",
            payment.getPaymentReference(), newAllocations.size(), totalAllocated, unallocatedRemaining);

        return newAllocations;
    }
}
