package com.guri24.rms.financial.domain.model;

import com.guri24.rms.financial.domain.enums.InvoiceStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @Column(name = "property_id", nullable = false)
    private UUID propertyId;

    @Column(name = "unit_id", nullable = false)
    private UUID unitId;

    @Column(name = "lease_id", nullable = false)
    private UUID leaseId;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "invoice_number", nullable = false, length = 64)
    private String invoiceNumber;

    @Column(name = "billing_period", nullable = false, length = 7)
    private String billingPeriod; // YYYY-MM

    @Column(name = "invoice_type", nullable = false, length = 32)
    @Builder.Default
    private String invoiceType = "MONTHLY_RENT";

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "subtotal_kes", nullable = false, precision = 14, scale = 2)
    private BigDecimal subtotalKes;

    @Column(name = "penalty_kes", nullable = false, precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal penaltyKes = BigDecimal.ZERO;

    @Column(name = "credit_applied_kes", nullable = false, precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal creditAppliedKes = BigDecimal.ZERO;

    @Column(name = "total_amount_kes", nullable = false, precision = 14, scale = 2)
    private BigDecimal totalAmountKes;

    @Column(name = "amount_paid_kes", nullable = false, precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal amountPaidKes = BigDecimal.ZERO;

    @Column(name = "balance_kes", nullable = false, precision = 14, scale = 2)
    private BigDecimal balanceKes;

    @Column(name = "currency", nullable = false, length = 3)
    @Builder.Default
    private String currency = "KES";

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 32)
    private InvoiceStatus status;

    @Column(name = "idempotency_key", nullable = false, length = 128)
    private String idempotencyKey;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<InvoiceItem> items = new ArrayList<>();

    public void recalculateBalance() {
        if (totalAmountKes != null && amountPaidKes != null) {
            BigDecimal bal = totalAmountKes.subtract(amountPaidKes);
            this.balanceKes = bal.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : bal;
            if (this.balanceKes.compareTo(BigDecimal.ZERO) == 0 && this.totalAmountKes.compareTo(BigDecimal.ZERO) > 0) {
                this.status = InvoiceStatus.PAID;
            } else if (this.amountPaidKes.compareTo(BigDecimal.ZERO) > 0) {
                this.status = InvoiceStatus.PARTIALLY_PAID;
            }
        }
    }
}
