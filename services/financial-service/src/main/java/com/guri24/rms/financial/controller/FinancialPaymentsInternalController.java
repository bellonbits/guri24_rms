package com.guri24.rms.financial.controller;

import com.guri24.rms.financial.config.TenantContextHolder;
import com.guri24.rms.financial.domain.model.Payment;
import com.guri24.rms.financial.domain.model.PaymentAllocation;
import com.guri24.rms.financial.repository.PaymentRepository;
import com.guri24.rms.financial.service.PaymentAllocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/internal/payments")
@RequiredArgsConstructor
public class FinancialPaymentsInternalController {

    private final PaymentRepository paymentRepository;
    private final PaymentAllocationService paymentAllocationService;

    @GetMapping
    public ResponseEntity<List<Payment>> listPayments(@RequestHeader(value = "X-Organization-Id", required = false) UUID headerOrgId) {
        UUID orgId = resolveOrgId(headerOrgId);
        return ResponseEntity.ok(paymentRepository.findByOrganizationIdOrderByCreatedAtDesc(orgId));
    }

    @PostMapping("/{id}/allocate")
    public ResponseEntity<List<PaymentAllocation>> allocateFifo(@RequestHeader(value = "X-Organization-Id", required = false) UUID headerOrgId,
                                                               @PathVariable("id") UUID id) {
        UUID orgId = resolveOrgId(headerOrgId);
        return ResponseEntity.ok(paymentAllocationService.allocatePaymentFifo(orgId, id));
    }

    private UUID resolveOrgId(UUID headerOrgId) {
        UUID contextId = TenantContextHolder.getOrganizationId();
        if (contextId != null) return contextId;
        if (headerOrgId != null) return headerOrgId;
        throw new IllegalArgumentException("Organization ID must be provided via X-Organization-Id header");
    }
}
