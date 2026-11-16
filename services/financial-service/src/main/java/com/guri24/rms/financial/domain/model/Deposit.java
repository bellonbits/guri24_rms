package com.guri24.rms.financial.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "deposits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Deposit {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @Column(name = "lease_id", nullable = false, unique = true)
    private UUID leaseId;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "unit_id", nullable = false)
    private UUID unitId;

    @Column(name = "required_amount_kes", nullable = false, precision = 14, scale = 2)
    private BigDecimal requiredAmountKes;

    @Column(name = "received_amount_kes", nullable = false, precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal receivedAmountKes = BigDecimal.ZERO;

    @Column(name = "deducted_amount_kes", nullable = false, precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal deductedAmountKes = BigDecimal.ZERO;

    @Column(name = "refunded_amount_kes", nullable = false, precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal refundedAmountKes = BigDecimal.ZERO;

    @Column(name = "current_liability_balance_kes", nullable = false, precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal currentLiabilityBalanceKes = BigDecimal.ZERO;

    @Column(name = "currency", nullable = false, length = 3)
    @Builder.Default
    private String currency = "KES";

    @Column(name = "status", nullable = false, length = 32)
    @Builder.Default
    private String status = "PENDING"; // PENDING, HELD, PARTIALLY_DEDUCTED, REFUNDED, FORFEITED

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    public void recalculateLiability() {
        BigDecimal held = receivedAmountKes != null ? receivedAmountKes : BigDecimal.ZERO;
        BigDecimal ded = deductedAmountKes != null ? deductedAmountKes : BigDecimal.ZERO;
        BigDecimal ref = refundedAmountKes != null ? refundedAmountKes : BigDecimal.ZERO;
        this.currentLiabilityBalanceKes = held.subtract(ded).subtract(ref);
        if (this.currentLiabilityBalanceKes.compareTo(BigDecimal.ZERO) < 0) {
            this.currentLiabilityBalanceKes = BigDecimal.ZERO;
        }
        if (this.currentLiabilityBalanceKes.compareTo(BigDecimal.ZERO) == 0 && held.compareTo(BigDecimal.ZERO) > 0) {
            this.status = "REFUNDED";
        } else if (held.compareTo(BigDecimal.ZERO) > 0) {
            this.status = "HELD";
        }
    }
}
