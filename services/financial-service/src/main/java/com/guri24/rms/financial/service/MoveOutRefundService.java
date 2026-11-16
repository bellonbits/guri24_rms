package com.guri24.rms.financial.service;

import com.guri24.rms.financial.domain.enums.RefundStatus;
import com.guri24.rms.financial.domain.model.Deposit;
import com.guri24.rms.financial.domain.model.DepositRefund;
import com.guri24.rms.financial.repository.DepositRefundRepository;
import com.guri24.rms.financial.repository.DepositRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MoveOutRefundService {

    private final DepositRepository depositRepository;
    private final DepositRefundRepository depositRefundRepository;

    /**
     * Stage 1 - 4: Calculates draft move-out refund based on held deposit and approved deductions
     * Formula: Refundable = Deposit Held - Approved Deductions - Prior Refunds
     */
    @Transactional
    public DepositRefund calculateRefundDraft(UUID orgId, UUID depositId, BigDecimal approvedDeductionsKes, String deductionsBreakdown) {
        Deposit deposit = depositRepository.findById(depositId)
            .filter(d -> d.getOrganizationId().equals(orgId))
            .orElseThrow(() -> new IllegalArgumentException("Deposit record not found for org: " + depositId));

        BigDecimal held = deposit.getReceivedAmountKes() != null ? deposit.getReceivedAmountKes() : BigDecimal.ZERO;
        BigDecimal priorDeductions = deposit.getDeductedAmountKes() != null ? deposit.getDeductedAmountKes() : BigDecimal.ZERO;
        BigDecimal priorRefunds = deposit.getRefundedAmountKes() != null ? deposit.getRefundedAmountKes() : BigDecimal.ZERO;

        BigDecimal totalDeductions = priorDeductions.add(approvedDeductionsKes != null ? approvedDeductionsKes : BigDecimal.ZERO);
        BigDecimal netRefundable = held.subtract(totalDeductions).subtract(priorRefunds);

        if (netRefundable.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalStateException("Approved deductions exceed total security deposit held in trust!");
        }

        DepositRefund refund = DepositRefund.builder()
            .organizationId(orgId)
            .depositId(deposit.getId())
            .tenantId(deposit.getTenantId())
            .leaseId(deposit.getLeaseId())
            .originalHeldKes(held)
            .approvedDeductionsKes(approvedDeductionsKes != null ? approvedDeductionsKes : BigDecimal.ZERO)
            .netRefundableKes(netRefundable)
            .status(RefundStatus.APPROVED_FOR_PAYOUT)
            .deductionsBreakdown(deductionsBreakdown)
            .build();

        DepositRefund saved = depositRefundRepository.save(refund);
        log.info("Calculated deposit refund for deposit {}: Held KES {}, Deductions KES {}, Net Refundable KES {}",
            depositId, held, approvedDeductionsKes, netRefundable);

        return saved;
    }

    /**
     * Stage 5 - 8: Executes verified refund disbursement with authoritative external payout reference
     */
    @Transactional
    public DepositRefund executeRefundPayout(UUID orgId, UUID refundId, String payoutChannel, String payoutReference) {
        if (payoutReference == null || payoutReference.isBlank()) {
            throw new IllegalArgumentException("Financial Invariant Violation: Verified refund requires authoritative external payout reference");
        }

        DepositRefund refund = depositRefundRepository.findById(refundId)
            .filter(r -> r.getOrganizationId().equals(orgId))
            .orElseThrow(() -> new IllegalArgumentException("Refund record not found for org: " + refundId));

        if (refund.getStatus() == RefundStatus.COMPLETED) {
            throw new IllegalStateException("Refund payout has already been finalized: " + refundId);
        }

        Deposit deposit = depositRepository.findById(refund.getDepositId())
            .filter(d -> d.getOrganizationId().equals(orgId))
            .orElseThrow(() -> new IllegalArgumentException("Deposit not found for refund: " + refund.getDepositId()));

        // Update deposit subledger liability
        BigDecimal newDeducted = (deposit.getDeductedAmountKes() != null ? deposit.getDeductedAmountKes() : BigDecimal.ZERO)
            .add(refund.getApprovedDeductionsKes());
        BigDecimal newRefunded = (deposit.getRefundedAmountKes() != null ? deposit.getRefundedAmountKes() : BigDecimal.ZERO)
            .add(refund.getNetRefundableKes());

        deposit.setDeductedAmountKes(newDeducted);
        deposit.setRefundedAmountKes(newRefunded);
        deposit.recalculateLiability();
        depositRepository.save(deposit);

        refund.setPayoutChannel(payoutChannel);
        refund.setPayoutReference(payoutReference);
        refund.setVerifiedDisbursedAt(OffsetDateTime.now());
        refund.setStatus(RefundStatus.COMPLETED);

        DepositRefund completed = depositRefundRepository.save(refund);
        log.info("Disbursed verified deposit refund {} of KES {} via {} (Ref: {})",
            refundId, refund.getNetRefundableKes(), payoutChannel, payoutReference);

        return completed;
    }

    public List<DepositRefund> listRefunds(UUID orgId) {
        return depositRefundRepository.findByOrganizationId(orgId);
    }
}
