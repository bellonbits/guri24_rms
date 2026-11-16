package com.guri24.rms.notification.adapter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;

@Component
@Slf4j
public class ResendEmailAdapter implements EmailProviderAdapter {

    @Value("${resend.api-key:}")
    private String resendApiKey;

    @Value("${resend.endpoint:https://api.resend.com/emails}")
    private String resendEndpoint;

    private final HttpClient httpClient = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(10))
        .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String getProviderName() {
        return "RESEND";
    }

    @Override
    public EmailDispatchResult sendEmail(String from, String to, String subject, String bodyHtml, String bodyText) {
        if (resendApiKey == null || resendApiKey.isBlank() || resendApiKey.contains("your_resend_api_key")) {
            log.warn("Resend API key is unconfigured. Simulating safe outbox acceptance for recipient: {}", to);
            return new EmailDispatchResult(true, "re_simulated_" + System.currentTimeMillis(), null);
        }

        try {
            Map<String, Object> payload = Map.of(
                "from", from,
                "to", new String[]{to},
                "subject", subject,
                "html", bodyHtml != null ? bodyHtml : "",
                "text", bodyText != null ? bodyText : ""
            );

            String requestBody = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(resendEndpoint))
                .header("Authorization", "Bearer " + resendApiKey.trim())
                .header("Content-Type", "application/json")
                .timeout(Duration.ofSeconds(15))
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                JsonNode root = objectMapper.readTree(response.body());
                String messageId = root.has("id") ? root.get("id").asText() : "re_" + System.currentTimeMillis();
                log.info("Successfully dispatched email to {} via Resend API (id: {})", to, messageId);
                return new EmailDispatchResult(true, messageId, null);
            } else {
                log.error("Resend API rejected email to {}. Status: {}, Response: {}", to, response.statusCode(), response.body());
                return new EmailDispatchResult(false, null, "Resend API error " + response.statusCode() + ": " + response.body());
            }
        } catch (Exception e) {
            log.error("Failed to send email to {} via Resend: {}", to, e.getMessage(), e);
            return new EmailDispatchResult(false, null, e.getMessage());
        }
    }
}
