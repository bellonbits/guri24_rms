package com.guri24.rms.notification.service;

import com.guri24.rms.notification.adapter.EmailProviderAdapter;
import com.guri24.rms.notification.domain.enums.DeliveryStatus;
import com.guri24.rms.notification.domain.model.NotificationDelivery;
import com.guri24.rms.notification.domain.model.NotificationSettings;
import com.guri24.rms.notification.repository.NotificationDeliveryRepository;
import com.guri24.rms.notification.repository.NotificationSettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationDispatchService {

    private final NotificationDeliveryRepository deliveryRepository;
    private final NotificationSettingsRepository settingsRepository;
    private final EmailProviderAdapter emailProviderAdapter;

    @Value("${resend.from-email:Guri24 RMS <guri24@aqivo.shop>}")
    private String defaultFromEmail;

    @Transactional
    public NotificationDelivery dispatchNotification(NotificationDelivery delivery) {
        // 1. Idempotency check: Suppress duplicate deliveries
        if (delivery.getIdempotencyKey() != null && !delivery.getIdempotencyKey().isBlank()) {
            Optional<NotificationDelivery> existing = deliveryRepository.findByOrganizationIdAndIdempotencyKey(
                delivery.getOrganizationId(), delivery.getIdempotencyKey()
            );
            if (existing.isPresent()) {
                log.info("Suppressed duplicate notification delivery for idempotency key: {}", delivery.getIdempotencyKey());
                return existing.get();
            }
        }

        // 2. Resolve sender
        String fromEmail = defaultFromEmail;
        Optional<NotificationSettings> settings = settingsRepository.findByOrganizationId(delivery.getOrganizationId());
        if (settings.isPresent() && settings.get().getEmailFrom() != null && !settings.get().getEmailFrom().isBlank()) {
            fromEmail = settings.get().getEmailFrom();
        }

        delivery.setStatus(DeliveryStatus.PROCESSING);
        NotificationDelivery saved = deliveryRepository.save(delivery);

        // 3. Dispatch via email provider
        EmailProviderAdapter.EmailDispatchResult result = emailProviderAdapter.sendEmail(
            fromEmail,
            saved.getRecipientEmail(),
            saved.getSubject(),
            saved.getBodyHtml(),
            saved.getBodyText()
        );

        if (result.success()) {
            saved.setStatus(DeliveryStatus.DELIVERED);
            saved.setProviderMessageId(result.providerMessageId());
            saved.setSentAt(OffsetDateTime.now());
            saved.setDeliveredAt(OffsetDateTime.now());
            saved.setErrorMessage(null);
            log.info("Dispatched notification {} to {} via {}", saved.getTemplateKey(), saved.getRecipientEmail(), emailProviderAdapter.getProviderName());
        } else {
            saved.setStatus(DeliveryStatus.FAILED);
            saved.setErrorMessage(result.errorMessage());
            log.error("Failed to dispatch notification to {}: {}", saved.getRecipientEmail(), result.errorMessage());
        }

        return deliveryRepository.save(saved);
    }

    @Transactional
    public NotificationDelivery retryDelivery(UUID orgId, UUID deliveryId) {
        NotificationDelivery delivery = deliveryRepository.findById(deliveryId)
            .filter(d -> d.getOrganizationId().equals(orgId))
            .orElseThrow(() -> new IllegalArgumentException("Notification delivery not found: " + deliveryId));

        if (delivery.getStatus() != DeliveryStatus.FAILED) {
            throw new IllegalStateException("Only failed deliveries can be retried");
        }
        if (delivery.getRetryCount() >= delivery.getMaxRetries()) {
            throw new IllegalStateException("Maximum retry attempts exceeded: " + delivery.getMaxRetries());
        }

        delivery.setRetryCount(delivery.getRetryCount() + 1);
        delivery.setStatus(DeliveryStatus.PROCESSING);

        EmailProviderAdapter.EmailDispatchResult result = emailProviderAdapter.sendEmail(
            defaultFromEmail,
            delivery.getRecipientEmail(),
            delivery.getSubject(),
            delivery.getBodyHtml(),
            delivery.getBodyText()
        );

        if (result.success()) {
            delivery.setStatus(DeliveryStatus.DELIVERED);
            delivery.setProviderMessageId(result.providerMessageId());
            delivery.setDeliveredAt(OffsetDateTime.now());
            delivery.setErrorMessage(null);
        } else {
            delivery.setStatus(DeliveryStatus.FAILED);
            delivery.setErrorMessage(result.errorMessage());
        }

        return deliveryRepository.save(delivery);
    }

    public List<NotificationDelivery> listDeliveries(UUID orgId) {
        return deliveryRepository.findByOrganizationIdOrderByCreatedAtDesc(orgId);
    }

    public NotificationSettings getSettings(UUID orgId) {
        return settingsRepository.findByOrganizationId(orgId)
            .orElseGet(() -> NotificationSettings.builder()
                .organizationId(orgId)
                .rentReminderDaysBefore(7)
                .rentDueDateReminder(true)
                .dailyCollectionSummary(true)
                .weeklyOperationalReport(true)
                .monthlyFinancialReport(true)
                .depositLiabilitySummary(true)
                .timezone("Africa/Nairobi")
                .emailFrom(defaultFromEmail)
                .build());
    }

    @Transactional
    public NotificationSettings updateSettings(UUID orgId, NotificationSettings updated) {
        NotificationSettings current = settingsRepository.findByOrganizationId(orgId)
            .orElseGet(() -> NotificationSettings.builder().organizationId(orgId).build());

        if (updated.getRentReminderDaysBefore() != null) current.setRentReminderDaysBefore(updated.getRentReminderDaysBefore());
        if (updated.getRentDueDateReminder() != null) current.setRentDueDateReminder(updated.getRentDueDateReminder());
        if (updated.getDailyCollectionSummary() != null) current.setDailyCollectionSummary(updated.getDailyCollectionSummary());
        if (updated.getWeeklyOperationalReport() != null) current.setWeeklyOperationalReport(updated.getWeeklyOperationalReport());
        if (updated.getMonthlyFinancialReport() != null) current.setMonthlyFinancialReport(updated.getMonthlyFinancialReport());
        if (updated.getDepositLiabilitySummary() != null) current.setDepositLiabilitySummary(updated.getDepositLiabilitySummary());
        if (updated.getEmailFrom() != null && !updated.getEmailFrom().isBlank()) current.setEmailFrom(updated.getEmailFrom());

        return settingsRepository.save(current);
    }
}
