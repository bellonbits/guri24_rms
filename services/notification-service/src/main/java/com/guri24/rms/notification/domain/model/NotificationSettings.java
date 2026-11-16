package com.guri24.rms.notification.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "notification_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "organization_id", nullable = false, unique = true)
    private UUID organizationId;

    @Column(name = "rent_reminder_days_before", nullable = false)
    @Builder.Default
    private Integer rentReminderDaysBefore = 7;

    @Column(name = "rent_due_date_reminder", nullable = false)
    @Builder.Default
    private Boolean rentDueDateReminder = true;

    @Column(name = "daily_collection_summary", nullable = false)
    @Builder.Default
    private Boolean dailyCollectionSummary = true;

    @Column(name = "weekly_operational_report", nullable = false)
    @Builder.Default
    private Boolean weeklyOperationalReport = true;

    @Column(name = "monthly_financial_report", nullable = false)
    @Builder.Default
    private Boolean monthlyFinancialReport = true;

    @Column(name = "deposit_liability_summary", nullable = false)
    @Builder.Default
    private Boolean depositLiabilitySummary = true;

    @Column(name = "timezone", nullable = false, length = 64)
    @Builder.Default
    private String timezone = "Africa/Nairobi";

    @Column(name = "email_from", nullable = false, length = 128)
    @Builder.Default
    private String emailFrom = "Guri24 RMS <guri24@aqivo.shop>";

    @Column(name = "brand_logo_url", columnDefinition = "TEXT")
    private String brandLogoUrl;

    @Column(name = "brand_primary_color", nullable = false, length = 32)
    @Builder.Default
    private String brandPrimaryColor = "#0f172a";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
