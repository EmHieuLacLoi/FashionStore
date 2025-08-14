package com.emhieulacloi.fashionstore.api.controller;

import com.emhieulacloi.fashionstore.api.base.controller.BaseController;
import com.emhieulacloi.fashionstore.api.domains.criteria.UserCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.request.UserRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.UserResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController
        extends BaseController<UserResponseDTO, UserCriteria, UserResponseDTO, UserRequestDTO, Long> {
}
