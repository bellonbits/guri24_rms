package com.guri24.rms.financial.repository;

import com.guri24.rms.financial.domain.model.Deposit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DepositRepository extends JpaRepository<Deposit, UUID> {
    List<Deposit> findByOrganizationId(UUID organizationId);
    Optional<Deposit> findByOrganizationIdAndLeaseId(UUID organizationId, UUID leaseId);
}
