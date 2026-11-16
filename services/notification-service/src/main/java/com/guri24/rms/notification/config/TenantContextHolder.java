package com.guri24.rms.notification.config;

import java.util.UUID;

public final class TenantContextHolder {

    private static final ThreadLocal<UUID> CURRENT_TENANT = new ThreadLocal<>();

    private TenantContextHolder() {}

    public static void setOrganizationId(UUID organizationId) {
        CURRENT_TENANT.set(organizationId);
    }

    public static UUID getOrganizationId() {
        return CURRENT_TENANT.get();
    }

    public static void clear() {
        CURRENT_TENANT.remove();
    }
}
