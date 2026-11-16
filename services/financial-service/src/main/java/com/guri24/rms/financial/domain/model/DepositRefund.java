package com.guri24.rms.financial.domain.model;

import com.guri24.rms.financial.domain.enums.RefundStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "deposit_refunds")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepositRefund {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @Column(name = "deposit_id", nullable = false)
    private UUID depositId;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "lease_id", nullable = false)
    private UUID leaseId;

    @Column(name = "original_held_kes", nullable = false, precision = 14, scale = 2)
    private BigDecimal originalHeldKes;

    @Column(name = "approved_deductions_kes", nullable = false, precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal approvedDeductionsKes = BigDecimal.ZERO;

    @Column(name = "net_refundable_kes", nullable = false, precision = 14, scale = 2)
    private BigDecimal netRefundableKes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 32)
    private RefundStatus status;

    @Column(name = "deductions_breakdown", columnDefinition = "TEXT")
    private String deductionsBreakdown;

    @Column(name = "payout_channel", length = 32)
    private String payoutChannel; // MPESA_B2C, BANK_TRANSFER, CHEQUE

    @Column(name = "payout_reference", length = 128)
    private String payoutReference; // External transaction reference from bank/Daraja

    @Column(name = "verified_disbursed_at")
    private OffsetDateTime verifiedDisbursedAt;

    @Column(name = "approved_by")
    private UUID approvedBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
