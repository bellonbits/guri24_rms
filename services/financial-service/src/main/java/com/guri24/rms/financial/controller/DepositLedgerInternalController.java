package com.guri24.rms.financial.controller;

import com.guri24.rms.financial.config.TenantContextHolder;
import com.guri24.rms.financial.domain.model.Deposit;
import com.guri24.rms.financial.domain.model.DepositRefund;
import com.guri24.rms.financial.service.DepositLiabilityService;
import com.guri24.rms.financial.service.MoveOutRefundService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/internal/deposits")
@RequiredArgsConstructor
public class DepositLedgerInternalController {

    private final DepositLiabilityService depositLiabilityService;
    private final MoveOutRefundService moveOutRefundService;

    @GetMapping
    public ResponseEntity<List<Deposit>> listDeposits(@RequestHeader(value = "X-Organization-Id", required = false) UUID headerOrgId) {
        UUID orgId = resolveOrgId(headerOrgId);
        return ResponseEntity.ok(depositLiabilityService.listDeposits(orgId));
    }

    @PostMapping("/receive")
    public ResponseEntity<Deposit> receiveDeposit(@RequestHeader(value = "X-Organization-Id", required = false) UUID headerOrgId,
                                                  @RequestBody ReceiveDepositRequest req) {
        UUID orgId = resolveOrgId(headerOrgId);
        return ResponseEntity.ok(depositLiabilityService.receiveDeposit(
            orgId, req.getLeaseId(), req.getTenantId(), req.getUnitId(), req.getAmountKes()
        ));
    }

    @GetMapping("/refunds")
    public ResponseEntity<List<DepositRefund>> listRefunds(@RequestHeader(value = "X-Organization-Id", required = false) UUID headerOrgId) {
        UUID orgId = resolveOrgId(headerOrgId);
        return ResponseEntity.ok(moveOutRefundService.listRefunds(orgId));
    }

    @PostMapping("/refunds/calculate")
    public ResponseEntity<DepositRefund> calculateDraft(@RequestHeader(value = "X-Organization-Id", required = false) UUID headerOrgId,
                                                        @RequestBody CalculateRefundRequest req) {
        UUID orgId = resolveOrgId(headerOrgId);
        return ResponseEntity.ok(moveOutRefundService.calculateRefundDraft(
            orgId, req.getDepositId(), req.getApprovedDeductionsKes(), req.getDeductionsBreakdown()
        ));
    }

    @PostMapping("/refunds/{id}/execute")
    public ResponseEntity<DepositRefund> executePayout(@RequestHeader(value = "X-Organization-Id", required = false) UUID headerOrgId,
                                                       @PathVariable("id") UUID id,
                                                       @RequestBody ExecutePayoutRequest req) {
        UUID orgId = resolveOrgId(headerOrgId);
        return ResponseEntity.ok(moveOutRefundService.executeRefundPayout(
            orgId, id, req.getPayoutChannel(), req.getPayoutReference()
        ));
    }

    private UUID resolveOrgId(UUID headerOrgId) {
        UUID contextId = TenantContextHolder.getOrganizationId();
        if (contextId != null) return contextId;
        if (headerOrgId != null) return headerOrgId;
        throw new IllegalArgumentException("Organization ID must be provided via X-Organization-Id header");
    }

    @Data
    public static class ReceiveDepositRequest {
        private UUID leaseId;
        private UUID tenantId;
        private UUID unitId;
        private BigDecimal amountKes;
    }

    @Data
    public static class CalculateRefundRequest {
        private UUID depositId;
        private BigDecimal approvedDeductionsKes;
        private String deductionsBreakdown;
    }

    @Data
    public static class ExecutePayoutRequest {
        private String payoutChannel;
        private String payoutReference;
    }
}
