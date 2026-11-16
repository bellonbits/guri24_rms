package com.guri24.rms.financial.service;

import com.guri24.rms.financial.domain.model.Deposit;
import com.guri24.rms.financial.repository.DepositRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DepositLiabilityService {

    private final DepositRepository depositRepository;

    @Transactional
    public Deposit receiveDeposit(UUID orgId, UUID leaseId, UUID tenantId, UUID unitId, BigDecimal amountKes) {
        if (amountKes == null || amountKes.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Deposit amount must be strictly greater than zero");
        }

        Deposit deposit = depositRepository.findByOrganizationIdAndLeaseId(orgId, leaseId)
            .orElseGet(() -> Deposit.builder()
                .organizationId(orgId)
                .leaseId(leaseId)
                .tenantId(tenantId)
                .unitId(unitId)
                .requiredAmountKes(amountKes)
                .receivedAmountKes(BigDecimal.ZERO)
                .deductedAmountKes(BigDecimal.ZERO)
                .refundedAmountKes(BigDecimal.ZERO)
                .currentLiabilityBalanceKes(BigDecimal.ZERO)
                .status("PENDING")
                .build());

        BigDecimal newReceived = (deposit.getReceivedAmountKes() != null ? deposit.getReceivedAmountKes() : BigDecimal.ZERO).add(amountKes);
        deposit.setReceivedAmountKes(newReceived);
        deposit.recalculateLiability();

        Deposit saved = depositRepository.save(deposit);
        log.info("Recorded security deposit receipt for lease {}: KES {} (Account 2100 Liability)", leaseId, amountKes);
        return saved;
    }

    public List<Deposit> listDeposits(UUID orgId) {
        return depositRepository.findByOrganizationId(orgId);
    }
}
