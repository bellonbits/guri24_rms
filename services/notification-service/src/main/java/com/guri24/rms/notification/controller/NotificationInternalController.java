package com.guri24.rms.notification.controller;

import com.guri24.rms.notification.config.TenantContextHolder;
import com.guri24.rms.notification.domain.model.NotificationDelivery;
import com.guri24.rms.notification.domain.model.NotificationSettings;
import com.guri24.rms.notification.service.NotificationDispatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/internal/notifications")
@RequiredArgsConstructor
public class NotificationInternalController {

    private final NotificationDispatchService notificationDispatchService;

    @PostMapping("/dispatch")
    public ResponseEntity<NotificationDelivery> dispatch(@RequestHeader(value = "X-Organization-Id", required = false) UUID headerOrgId,
                                                         @RequestBody NotificationDelivery delivery) {
        UUID orgId = resolveOrgId(headerOrgId);
        delivery.setOrganizationId(orgId);
        return ResponseEntity.ok(notificationDispatchService.dispatchNotification(delivery));
    }

    @GetMapping("/settings")
    public ResponseEntity<NotificationSettings> getSettings(@RequestHeader(value = "X-Organization-Id", required = false) UUID headerOrgId) {
        UUID orgId = resolveOrgId(headerOrgId);
        return ResponseEntity.ok(notificationDispatchService.getSettings(orgId));
    }

    @PatchMapping("/settings")
    public ResponseEntity<NotificationSettings> updateSettings(@RequestHeader(value = "X-Organization-Id", required = false) UUID headerOrgId,
                                                               @RequestBody NotificationSettings settings) {
        UUID orgId = resolveOrgId(headerOrgId);
        return ResponseEntity.ok(notificationDispatchService.updateSettings(orgId, settings));
    }

    @GetMapping("/deliveries")
    public ResponseEntity<List<NotificationDelivery>> listDeliveries(@RequestHeader(value = "X-Organization-Id", required = false) UUID headerOrgId) {
        UUID orgId = resolveOrgId(headerOrgId);
        return ResponseEntity.ok(notificationDispatchService.listDeliveries(orgId));
    }

    @PostMapping("/deliveries/{id}/retry")
    public ResponseEntity<NotificationDelivery> retryDelivery(@RequestHeader(value = "X-Organization-Id", required = false) UUID headerOrgId,
                                                              @PathVariable("id") UUID id) {
        UUID orgId = resolveOrgId(headerOrgId);
        return ResponseEntity.ok(notificationDispatchService.retryDelivery(orgId, id));
    }

    private UUID resolveOrgId(UUID headerOrgId) {
        UUID contextId = TenantContextHolder.getOrganizationId();
        if (contextId != null) return contextId;
        if (headerOrgId != null) return headerOrgId;
        throw new IllegalArgumentException("Organization ID must be provided via X-Organization-Id header");
    }
}
