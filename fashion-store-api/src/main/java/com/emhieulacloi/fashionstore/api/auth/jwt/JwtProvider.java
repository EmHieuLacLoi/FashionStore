package com.emhieulacloi.fashionstore.api.auth.jwt;

import com.emhieulacloi.fashionstore.api.auth.principle.UserDetailsImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;

@Component
@Slf4j
public class JwtProvider {
    @Value("${security.jwt.secret}")
    private String secret;
    @Value("${security.jwt.expiration}")
    private long tokenExpirationAfterDays;

    private final HttpServletRequest request;

    public JwtProvider(HttpServletRequest request) {
        this.request = request;
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(UserDetailsImpl userPrincipal) {
        var now = Instant.now();
        return Jwts.builder()
                .subject(userPrincipal.getUsername())
                .claim("roles", userPrincipal.getRoles())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(tokenExpirationAfterDays)))
                .signWith(getSigningKey())
                .compact();
    }

    public Boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.error("expired Token {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("invalid format {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("Unsupported token {}", e.getMessage());
        } catch (SignatureException e) {
            log.error("Invalid Signature {}", e.getMessage());
        }
        return false;
    }

    public List<SimpleGrantedAuthority> getAuthoritiesFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        List<?> rawRoles = (List<?>) claims.get("roles");
        List<String> roles = rawRoles.stream()
                .map(Object::toString)
                .toList();

        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
    }

    private Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String getUserNameToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public String getTokenFromRequest() {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
