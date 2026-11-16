package com.guri24.rms.financial.repository;

import com.guri24.rms.financial.domain.model.PropertyExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PropertyExpenseRepository extends JpaRepository<PropertyExpense, UUID> {
    List<PropertyExpense> findByOrganizationIdOrderByExpenseDateDesc(UUID organizationId);
}
