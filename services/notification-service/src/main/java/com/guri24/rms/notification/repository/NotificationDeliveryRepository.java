package com.guri24.rms.notification.repository;

import com.guri24.rms.notification.domain.model.NotificationDelivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationDeliveryRepository extends JpaRepository<NotificationDelivery, UUID> {
    List<NotificationDelivery> findByOrganizationIdOrderByCreatedAtDesc(UUID organizationId);
    Optional<NotificationDelivery> findByOrganizationIdAndIdempotencyKey(UUID organizationId, String idempotencyKey);
    boolean existsByOrganizationIdAndIdempotencyKey(UUID organizationId, String idempotencyKey);
}
