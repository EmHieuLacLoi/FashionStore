package com.emhieulacloi.fashionstore.api.auth.jwt;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Objects;

@Component
public class AccessDenied implements AccessDeniedHandler {

    private static final Logger logger = LoggerFactory.getLogger(AccessDenied.class);

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException {
        logger.error("Access denied to user: {} for URL: {}: {}",
                request.getRemoteUser(), request.getRequestURL(), accessDeniedException.getMessage());

        ResponseEntity<String> responseEntity = new ResponseEntity<>("Access Denied", HttpStatus.FORBIDDEN);
        response.setStatus(responseEntity.getStatusCode().value());
        response.getWriter().write(Objects.requireNonNull(responseEntity.getBody()));
    }
}
