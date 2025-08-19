package com.emhieulacloi.fashionstore.api.controller;

import com.emhieulacloi.fashionstore.api.common.component.ResponseDataConfiguration;
import com.emhieulacloi.fashionstore.api.domains.dto.request.LoginRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.request.UserRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.LoginResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.UserResponseDTO;
import com.emhieulacloi.fashionstore.api.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/v1/auth")
@Slf4j
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        log.info("--- start call api/auth/login ---");
        ResponseEntity<LoginResponseDTO> response = null;
        try {
            response = ResponseDataConfiguration.success(userService.login(request));
        } catch (Exception e) {
            response = ResponseDataConfiguration.handleResponseException(e);
        }
        log.info("--- end call api/auth/login ---");
        return response;
    }

    @GetMapping("/info")
    public ResponseEntity<UserResponseDTO> getInfo() {
        log.info("--- start call api/auth/ getDetail ---");
        ResponseEntity<UserResponseDTO> response;
        try {
            response = ResponseDataConfiguration.success(userService.getDetail());
        } catch (Exception e) {
            response = ResponseDataConfiguration.handleResponseException(e);
        }
        log.info("--- end call api/auth/ getDetail ---");
        return response;
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponseDTO> update(@RequestBody UserRequestDTO reqDto) {
        log.info("--- start call api/auth/ update ---");
        ResponseEntity<UserResponseDTO> response;
        try {
            response = ResponseDataConfiguration.success(userService.update(reqDto));
        } catch (Exception e) {
            response = ResponseDataConfiguration.handleResponseException(e);
        }
        log.info("--- end call api/auth/update ---");
        return response;
    }

    @PutMapping("/change-password")
    public ResponseEntity<UserResponseDTO> changePassword(@RequestBody UserRequestDTO reqDto) {
        log.info("--- start call api/auth/ change password ---");
        ResponseEntity<UserResponseDTO> response;
        try {
            response = ResponseDataConfiguration.success(userService.changePassword(reqDto));
        } catch (Exception e) {
            response = ResponseDataConfiguration.handleResponseException(e);
        }
        log.info("--- end call api/auth/ change password ---");
        return response;
    }
}
