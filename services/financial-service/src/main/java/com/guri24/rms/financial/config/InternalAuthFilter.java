package com.guri24.rms.financial.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
public class InternalAuthFilter extends OncePerRequestFilter {

    @Value("${internal.auth.secret}")
    private String expectedInternalSecret;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();

        // Allow actuator health checks and metrics without authentication
        if (path.startsWith("/actuator") || path.equals("/health")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Validate internal service secret key
        String providedKey = request.getHeader("X-Internal-Service-Key");
        if (providedKey == null || !providedKey.equals(expectedInternalSecret)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Unauthorized\",\"message\":\"Invalid or missing X-Internal-Service-Key\"}");
            return;
        }

        // Extract and validate tenant organization ID
        String orgIdHeader = request.getHeader("X-Organization-Id");
        if (orgIdHeader != null && !orgIdHeader.isBlank()) {
            try {
                UUID orgId = UUID.fromString(orgIdHeader);
                TenantContextHolder.setOrganizationId(orgId);
            } catch (IllegalArgumentException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Bad Request\",\"message\":\"Invalid UUID in X-Organization-Id header\"}");
                return;
            }
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            TenantContextHolder.clear();
        }
    }
}
