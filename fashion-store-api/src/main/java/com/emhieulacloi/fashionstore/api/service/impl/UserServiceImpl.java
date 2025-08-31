package com.emhieulacloi.fashionstore.api.service.impl;

import com.emhieulacloi.fashionstore.api.auth.AuthUtils;
import com.emhieulacloi.fashionstore.api.auth.jwt.JwtProvider;
import com.emhieulacloi.fashionstore.api.auth.principle.UserDetailsImpl;
import com.emhieulacloi.fashionstore.api.common.component.MessageResource;
import com.emhieulacloi.fashionstore.api.common.exception.CommonException;
import com.emhieulacloi.fashionstore.api.domains.dto.request.LoginRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.request.UserRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.LoginResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.UserResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Role;
import com.emhieulacloi.fashionstore.api.domains.entity.User;
import com.emhieulacloi.fashionstore.api.domains.entity.UserRole;
import com.emhieulacloi.fashionstore.api.enums.SystemCodeEnum;
import com.emhieulacloi.fashionstore.api.repository.RoleRepository;
import com.emhieulacloi.fashionstore.api.repository.UserRepository;
import com.emhieulacloi.fashionstore.api.repository.UserRoleRepository;
import com.emhieulacloi.fashionstore.api.service.UserService;
import com.emhieulacloi.fashionstore.api.service.mapper.UserMapper;
import com.emhieulacloi.fashionstore.api.util.FmsUtil;
import com.emhieulacloi.fashionstore.api.util.ValidationUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@Primary
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AuthenticationProvider authenticationProvider;
    private final MessageResource messageResource;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;

    public UserServiceImpl(UserRepository userRepository,
                           AuthenticationProvider authenticationProvider,
                           MessageResource messageResource,
                           PasswordEncoder passwordEncoder,
                           JwtProvider jwtProvider,
                           UserMapper userMapper, RoleRepository roleRepository,
                           UserRoleRepository userRoleRepository) {
        this.userRepository = userRepository;
        this.authenticationProvider = authenticationProvider;
        this.messageResource = messageResource;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
        this.userMapper = userMapper;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
    }

    @Override
    public UserResponseDTO save(UserRequestDTO userRequestDTO) {
        try {
            if (userRepository.existsByUsername(userRequestDTO.getUsername())) {
                throw new CommonException().setStatusCode(HttpStatus.BAD_REQUEST).setErrorCode(SystemCodeEnum.ERROR_012.getCode(), messageResource);
            }

            if (userRequestDTO.getPhoneNumber() != null) {
                Optional<User> userByPhone = userRepository.findOneByPhoneNumber(userRequestDTO.getPhoneNumber());
                if (userByPhone.isPresent()) {
                    throw new CommonException()
                            .setStatusCode(HttpStatus.BAD_REQUEST)
                            .setErrorCode(SystemCodeEnum.ERROR_013.getCode(), messageResource);
                }
            }

            if (userRequestDTO.getEmail() != null) {
                Optional<User> userByEmail = userRepository.findOneByEmailEqualsIgnoreCase(userRequestDTO.getEmail());
                if (userByEmail.isPresent()) {
                    throw new CommonException()
                            .setStatusCode(HttpStatus.BAD_REQUEST)
                            .setErrorCode(SystemCodeEnum.ERROR_017.getCode(), messageResource);
                }
            }

            this.checkPassword(userRequestDTO.getPassword(), null, null);
            User userNew = userMapper.toEntity(userRequestDTO);
            userNew.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
            User user = this.userRepository.save(userNew);
            Long roleId = userRequestDTO.getRoleId();
            if (roleId != null) {
                UserRole userRole = new UserRole();
                userRole.setUserId(user.getId());
                userRole.setRoleId(roleId);
                userRoleRepository.save(userRole);
            }
            return userMapper.entityToResponse(user);
        } catch (CommonException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new CommonException().setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public UserResponseDTO update(UserRequestDTO userRequestDTO) {
        try {
            User userLogin = AuthUtils.getCurrentUser();
            User user = userRepository.findById(userLogin.getId()).orElse(null);
            if (Objects.isNull(user)) {
                throw new CommonException()
                        .setStatusCode(HttpStatus.BAD_REQUEST)
                        .setErrorCode(SystemCodeEnum.ERROR_002.getCode(), messageResource);
            }
            user.setEmail(FmsUtil.validateStrings(userRequestDTO.getEmail()));
            user.setFullName(FmsUtil.validateStrings(userRequestDTO.getFullName()));
            user.setPhoneNumber(FmsUtil.validateStrings(userRequestDTO.getPhoneNumber()));
            user.setAddress(FmsUtil.validateStrings(userRequestDTO.getAddress()));
            this.userRepository.save(user);
            return userMapper.entityToResponse(user);
        } catch (CommonException e) {
            throw e;
        } catch (Exception ex) {
            log.error("update user {}", ex.getMessage());
            throw ex;
        }
    }

    @Override
    public Integer delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new CommonException()
                    .setStatusCode(HttpStatus.BAD_REQUEST)
                    .setErrorCode(SystemCodeEnum.ERROR_002.getCode(), messageResource);
        }

        UserRole userRole = userRoleRepository.findByUserId(id);
        if (userRole != null) {
            userRoleRepository.delete(userRole);
        }

        userRepository.deleteById(id);
        return 1;
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        Authentication authentication = authenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDTO.getUsername(),
                        loginRequestDTO.getPassword()
                )
        );

        UserDetailsImpl userPrinciple = (UserDetailsImpl) authentication.getPrincipal();

        Set<String> roles = userPrinciple.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        String token = jwtProvider.generateToken(userPrinciple);
        return new LoginResponseDTO(loginRequestDTO.getUsername(), token, roles);
    }

    @Override
    public UserResponseDTO getDetail() throws CommonException {
        User user = AuthUtils.getCurrentUser();
        User userRes = userRepository.findById(user.getId()).orElseThrow(() -> new CommonException()
                .setStatusCode(HttpStatus.BAD_REQUEST)
                .setErrorCode(SystemCodeEnum.ERROR_002.getCode(), messageResource));
        UserResponseDTO userResponseDTO = userMapper.entityToResponse(userRes);
        UserRole userRole = userRoleRepository.findByUserId((user.getId()));
        if (userRole != null) {
            Role role = roleRepository.findById(userRole.getRoleId())
                    .orElseThrow(() -> new CommonException()
                            .setStatusCode(HttpStatus.BAD_REQUEST)
                            .setErrorCode(SystemCodeEnum.ERROR_002.getCode(), messageResource));
            if (role == null) {
                throw new CommonException()
                        .setStatusCode(HttpStatus.BAD_REQUEST)
                        .setErrorCode(SystemCodeEnum.ERROR_002.getCode(), messageResource);
            }
            userResponseDTO.setRole(role.getName());
        }
        return userResponseDTO;
    }

    @Override
    public UserResponseDTO changePassword(UserRequestDTO userRequestDTO) throws CommonException {
        try {
            User userLogin = AuthUtils.getCurrentUser();
            User user = userRepository.findById(userLogin.getId()).orElse(null);
            if (Objects.isNull(user)) {
                throw new CommonException()
                        .setStatusCode(HttpStatus.BAD_REQUEST)
                        .setErrorCode(SystemCodeEnum.ERROR_002.getCode(), messageResource);
            }
            if (userRequestDTO.getPassword() == null || user.getPassword().trim().isEmpty()) {
                throw new CommonException()
                        .setStatusCode(HttpStatus.BAD_REQUEST)
                        .setErrorCode(SystemCodeEnum.ERROR_002.getCode(), messageResource);
            }
            String password = user.getPassword();
            String rawPassword = userRequestDTO.getPassword();
            String oldPassword = userRequestDTO.getOldPassword();
            this.checkPassword(rawPassword, password, oldPassword);
            user.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
            this.userRepository.save(user);
            return userMapper.entityToResponse(user);
        } catch (CommonException e) {
            throw e;
        } catch (Exception ex) {
            log.error("update password {}", ex.getMessage());
            throw ex;
        }
    }

    @Override
    public Page<UserResponseDTO> getList(UserRequestDTO request, Pageable pageable) {
        Long roleId = request.getRoleId();

        Page<User> users = userRepository.findUsersByFilters(
                request.getUsername() == null ? null : request.getUsername().trim(),
                request.getEmail(),
                request.getFullName() == null ? null : request.getFullName().trim(),
                request.getPhoneNumber() == null ? null : request.getPhoneNumber().trim(),
                pageable);

        List<UserResponseDTO> responseDTOs = users.getContent().stream()
                .map(userMapper::entityToResponse)
                .collect(Collectors.toList());

        return new PageImpl<>(responseDTOs, pageable, users.getTotalElements());
    }

    private void checkPassword(String rawPassword, String password, String oldPassword) throws CommonException {
        boolean isValid = ValidationUtils.isValidPassword(rawPassword);

        if (oldPassword != null) {
            String message = messageResource.getMessage("error.password.not.same.old");
            boolean isMatch = passwordEncoder.matches(oldPassword, password);
            if (!isMatch) {
                throw new CommonException()
                        .setStatusCode(HttpStatus.BAD_REQUEST)
                        .setMessage(message);
            }
        }

        if (!isValid) {
            String message = messageResource.getMessage("valid.password.message");
            throw new CommonException()
                    .setStatusCode(HttpStatus.BAD_REQUEST)
                    .setMessage(message);
        }

        if (password != null) {
            String message = messageResource.getMessage("error.password.same.old");
            boolean isMatch = passwordEncoder.matches(rawPassword, password);
            if (isMatch) {
                throw new CommonException()
                        .setStatusCode(HttpStatus.BAD_REQUEST)
                        .setMessage(message);
            }
        }
    }

}
