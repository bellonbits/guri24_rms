package com.guri24.rms.financial.repository;

import com.guri24.rms.financial.domain.model.DepositRefund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DepositRefundRepository extends JpaRepository<DepositRefund, UUID> {
    List<DepositRefund> findByOrganizationId(UUID organizationId);
    Optional<DepositRefund> findByOrganizationIdAndDepositId(UUID organizationId, UUID depositId);
}
