package com.emhieulacloi.fashionstore.api.auth.jwt;

import com.emhieulacloi.fashionstore.api.common.component.ResponseData;
import com.emhieulacloi.fashionstore.api.common.contanst.ResponseStatusConst;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
public class AccessDenied implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException {
        log.error("Access denied to user: {} for URL: {}: {}",
                request.getRemoteUser(), request.getRequestURL(), accessDeniedException.getMessage());

        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);

        ResponseData<String> responseData = new ResponseData<>(
                ResponseStatusConst.ERROR,
                "Access Denied",
                "FORBIDDEN"
        );

        String json = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(responseData);
        response.getWriter().write(json);
    }
}
