package com.guri24.rms.financial.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "journal_lines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JournalLine {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "journal_entry_id", nullable = false)
    @JsonIgnore
    private JournalEntry journalEntry;

    @Column(name = "account_id", nullable = false)
    private UUID accountId;

    @Column(name = "tenant_id")
    private UUID tenantId;

    @Column(name = "lease_id")
    private UUID leaseId;

    @Column(name = "debit_kes", nullable = false, precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal debitKes = BigDecimal.ZERO;

    @Column(name = "credit_kes", nullable = false, precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal creditKes = BigDecimal.ZERO;

    @Column(name = "memo", columnDefinition = "TEXT")
    private String memo;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}
