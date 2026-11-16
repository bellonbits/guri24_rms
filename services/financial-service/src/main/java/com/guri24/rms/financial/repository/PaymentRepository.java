package com.guri24.rms.financial.repository;

import com.guri24.rms.financial.domain.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByOrganizationIdOrderByCreatedAtDesc(UUID organizationId);
    Optional<Payment> findByOrganizationIdAndPaymentReference(UUID organizationId, String paymentReference);
    Optional<Payment> findByOrganizationIdAndIdempotencyKey(UUID organizationId, String idempotencyKey);
    Optional<Payment> findByOrganizationIdAndProviderReceiptNumber(UUID organizationId, String providerReceiptNumber);
}
