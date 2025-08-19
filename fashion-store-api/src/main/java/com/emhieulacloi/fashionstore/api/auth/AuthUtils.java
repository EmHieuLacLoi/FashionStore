package com.emhieulacloi.fashionstore.api.auth;

import com.emhieulacloi.fashionstore.api.auth.principle.UserDetailsImpl;
import com.emhieulacloi.fashionstore.api.common.exception.CommonException;
import com.emhieulacloi.fashionstore.api.domains.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Slf4j
public class AuthUtils {
    public static User getCurrentUser() throws CommonException {
        try {
            return ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                    .getPrincipal()).getUser();
        } catch (Exception e) {
            log.error("=== ERROR get current user: {}", e.getMessage());
            throw new CommonException()
                    .setStatusCode(HttpStatus.UNAUTHORIZED);
        }
    }

    public static Long getCurrentUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null
                    && authentication.isAuthenticated()
                    && !(authentication instanceof AnonymousAuthenticationToken)) {

                Object principal = authentication.getPrincipal();
                if (principal instanceof UserDetailsImpl userPrincipal) {
                    return userPrincipal.getUser().getId();
                }
            }
        } catch (Exception e) {
            log.error("=== ERROR get current user: {}", e.getMessage());
        }
        return null;
    }
}
