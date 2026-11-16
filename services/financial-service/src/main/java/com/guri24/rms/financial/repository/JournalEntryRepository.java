package com.guri24.rms.financial.repository;

import com.guri24.rms.financial.domain.model.JournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, UUID> {
    List<JournalEntry> findByOrganizationIdOrderByEntryDateDesc(UUID organizationId);
    Optional<JournalEntry> findByOrganizationIdAndEntryNumber(UUID organizationId, String entryNumber);
    boolean existsByOrganizationIdAndEntryNumber(UUID organizationId, String entryNumber);
}
