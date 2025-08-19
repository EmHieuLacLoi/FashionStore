package com.emhieulacloi.fashionstore.api.auth.jwt;

import com.emhieulacloi.fashionstore.api.auth.principle.UserDetailsServiceImpl;
import com.emhieulacloi.fashionstore.api.common.component.ResponseData;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JWTTokenFilter extends OncePerRequestFilter {

    private final JwtProvider jwtTokenProvider;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain chain)
            throws ServletException, IOException {
        try {
            String token = getTokenFromRequest(request);

            if (token != null && this.jwtTokenProvider.validateToken(token)) {
                String username = this.jwtTokenProvider.getUserNameToken(token);
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                List<SimpleGrantedAuthority> authorities = jwtTokenProvider.getAuthoritiesFromToken(token);
                if (userDetails != null) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            ResponseData data = new ResponseData(HttpServletResponse.SC_FORBIDDEN, e.getMessage());
            data.setErrorStatus(HttpServletResponse.SC_FORBIDDEN);
            data.setErrorMessage(e.getMessage());
            data.setErrorCode("SC_FORBIDDEN");
            log.error("Authentication failed: {}", e.getMessage());
        }

        chain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}

