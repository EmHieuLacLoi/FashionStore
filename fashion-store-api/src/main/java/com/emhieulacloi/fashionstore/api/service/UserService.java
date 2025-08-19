package com.emhieulacloi.fashionstore.api.service;

import com.emhieulacloi.fashionstore.api.base.service.CustomCrudService;
import com.emhieulacloi.fashionstore.api.common.exception.CommonException;
import com.emhieulacloi.fashionstore.api.domains.dto.request.LoginRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.request.UserRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.LoginResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.UserResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    LoginResponseDTO login(LoginRequestDTO loginRequestDTO);

    UserResponseDTO getDetail() throws CommonException;

    UserResponseDTO changePassword(UserRequestDTO userRequestDTO) throws CommonException;

    Page<UserResponseDTO> getList(UserRequestDTO request, Pageable pageable);

    UserResponseDTO save(UserRequestDTO dto);

    UserResponseDTO update(UserRequestDTO dto);

    Integer delete(Long id);
}
