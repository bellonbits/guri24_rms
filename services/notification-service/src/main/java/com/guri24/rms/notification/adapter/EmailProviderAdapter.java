package com.guri24.rms.notification.adapter;

public interface EmailProviderAdapter {
    String getProviderName();
    EmailDispatchResult sendEmail(String from, String to, String subject, String bodyHtml, String bodyText);

    record EmailDispatchResult(boolean success, String providerMessageId, String errorMessage) {}
}
