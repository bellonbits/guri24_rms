package com.guri24.rms.financial.domain.model;

import com.guri24.rms.financial.domain.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @Column(name = "property_id")
    private UUID propertyId;

    @Column(name = "unit_id")
    private UUID unitId;

    @Column(name = "lease_id")
    private UUID leaseId;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "payment_reference", nullable = false, length = 64)
    private String paymentReference;

    @Column(name = "idempotency_key", nullable = false, length = 128)
    private String idempotencyKey;

    @Column(name = "payment_method", nullable = false, length = 32)
    private String paymentMethod; // MPESA_STK, MPESA_C2B, BANK_TRANSFER, MANUAL_ADJUSTMENT

    @Column(name = "amount_kes", nullable = false, precision = 14, scale = 2)
    private BigDecimal amountKes;

    @Column(name = "allocated_amount_kes", nullable = false, precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal allocatedAmountKes = BigDecimal.ZERO;

    @Column(name = "unallocated_amount_kes", nullable = false, precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal unallocatedAmountKes = BigDecimal.ZERO;

    @Column(name = "currency", nullable = false, length = 3)
    @Builder.Default
    private String currency = "KES";

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 32)
    private PaymentStatus status;

    @Column(name = "provider_receipt_number", length = 64)
    private String providerReceiptNumber; // e.g. M-Pesa Receipt "SJK8912XYZ"

    @Column(name = "payer_phone", length = 32)
    private String payerPhone;

    @Column(name = "paid_at")
    private OffsetDateTime paidAt;

    @Column(name = "reversed_at")
    private OffsetDateTime reversedAt;

    @Column(name = "reversal_reason", columnDefinition = "TEXT")
    private String reversalReason;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "payment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<PaymentAllocation> allocations = new ArrayList<>();

    public void addAllocation(PaymentAllocation alloc) {
        allocations.add(alloc);
        alloc.setPayment(this);
    }
}
