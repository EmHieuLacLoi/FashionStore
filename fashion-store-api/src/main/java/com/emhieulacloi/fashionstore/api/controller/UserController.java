package com.emhieulacloi.fashionstore.api.controller;

import com.emhieulacloi.fashionstore.api.common.component.ResponseDataConfiguration;
import com.emhieulacloi.fashionstore.api.domains.dto.request.UserRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.UserResponseDTO;
import com.emhieulacloi.fashionstore.api.service.UserService;
import com.emhieulacloi.fashionstore.api.service.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("")
    public ResponseEntity<Page<UserResponseDTO>> getList(@ModelAttribute UserRequestDTO request, Pageable pageable) {
        ResponseEntity<Page<UserResponseDTO>> response;
        try {
            response = ResponseDataConfiguration.success(userService.getList(request, pageable));
        } catch (Exception e) {
            response = ResponseDataConfiguration.handleResponseException(e);
        }
        return response;

    }

    @PostMapping("")
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody UserRequestDTO request) {
        ResponseEntity<UserResponseDTO> response;
        try {
            response = ResponseDataConfiguration.success(userService.save(request));
        } catch (Exception e) {
            response = ResponseDataConfiguration.handleResponseException(e);
        }
        return response;

    }

    @PutMapping("")
    public ResponseEntity<UserResponseDTO> updateUser(@RequestBody UserRequestDTO request) {
        ResponseEntity<UserResponseDTO> response;
        try {
            response = ResponseDataConfiguration.success(userService.update(request));
        } catch (Exception e) {
            response = ResponseDataConfiguration.handleResponseException(e);
        }
        return response;

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        ResponseEntity<Integer> response;
        try {
            response = ResponseDataConfiguration.success(userService.delete(id));
        } catch (Exception e) {
            response = ResponseDataConfiguration.handleResponseException(e);
        }
        return response;
    }
}
