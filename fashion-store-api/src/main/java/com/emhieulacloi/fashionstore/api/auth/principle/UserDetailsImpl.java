package com.emhieulacloi.fashionstore.api.auth.principle;

import com.emhieulacloi.fashionstore.api.domains.entity.User;
import com.emhieulacloi.fashionstore.api.enums.ActivityStatus;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Data
public class UserDetailsImpl implements UserDetails {

    @Serial
    private static final long serialVersionUID = -2899719702478506150L;
    private transient User user;
    private Collection<? extends GrantedAuthority> authorities;

    public Set<String> getRoles() {
        return authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toSet());
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isEnabled() {
        return user.getStatus() != null
                && Objects.equals(ActivityStatus.ACTIVE.getValue(), user.getStatus());
    }
}
