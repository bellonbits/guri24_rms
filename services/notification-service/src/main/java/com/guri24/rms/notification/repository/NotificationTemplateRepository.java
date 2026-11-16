package com.guri24.rms.notification.repository;

import com.guri24.rms.notification.domain.model.NotificationTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationTemplateRepository extends JpaRepository<NotificationTemplate, UUID> {
    List<NotificationTemplate> findByOrganizationIdOrOrganizationIdIsNull(UUID organizationId);
    Optional<NotificationTemplate> findByTemplateKeyAndOrganizationId(String templateKey, UUID organizationId);
    Optional<NotificationTemplate> findFirstByTemplateKeyAndOrganizationIdIsNullOrderByVersionDesc(String templateKey);
}
