package com.emhieulacloi.fashionstore.api.auth.principle;

import com.emhieulacloi.fashionstore.api.common.component.MessageResource;
import com.emhieulacloi.fashionstore.api.common.exception.CommonException;
import com.emhieulacloi.fashionstore.api.domains.entity.User;
import com.emhieulacloi.fashionstore.api.enums.SystemCodeEnum;
import com.emhieulacloi.fashionstore.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;
    private final MessageResource messageResource;

    @SneakyThrows
    @Override
    public UserDetails loadUserByUsername(String username)  {
        Optional<User> userOptional = userRepository.findOneByUsername(username)
                .or(() -> userRepository.findOneByEmailEqualsIgnoreCase(username))
                .or(() -> userRepository.findOneByPhoneNumber(username));

        User user = userOptional.orElseThrow(() -> new CommonException()
                .setStatusCode(HttpStatus.BAD_REQUEST)
                .setErrorCode(SystemCodeEnum.ERROR_002.getCode(), messageResource)
                .setMessage(String.format("User does not exist, username: %s", username)));

        UserDetailsImpl userPrinciple = new UserDetailsImpl();
        userPrinciple.setUser(user);
        userPrinciple.setAuthorities(user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toSet()));
        return userPrinciple;
    }
}
