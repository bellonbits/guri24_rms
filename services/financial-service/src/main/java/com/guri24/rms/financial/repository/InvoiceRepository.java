package com.guri24.rms.financial.repository;

import com.guri24.rms.financial.domain.enums.InvoiceStatus;
import com.guri24.rms.financial.domain.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    List<Invoice> findByOrganizationIdOrderByDueDateAsc(UUID organizationId);
    List<Invoice> findByOrganizationIdAndTenantId(UUID organizationId, UUID tenantId);
    Optional<Invoice> findByOrganizationIdAndInvoiceNumber(UUID organizationId, String invoiceNumber);
    Optional<Invoice> findByOrganizationIdAndIdempotencyKey(UUID organizationId, String idempotencyKey);

    @Query("SELECT i FROM Invoice i WHERE i.organizationId = :orgId AND i.tenantId = :tenantId AND i.status IN ('ISSUED', 'PARTIALLY_PAID', 'OVERDUE') ORDER BY i.dueDate ASC")
    List<Invoice> findUnpaidInvoicesForTenantFifo(@Param("orgId") UUID orgId, @Param("tenantId") UUID tenantId);
}
