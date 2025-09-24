package com.emhieulacloi.fashionstore.api.controller;

import com.emhieulacloi.fashionstore.api.base.controller.BaseController;
import com.emhieulacloi.fashionstore.api.domains.criteria.DesignCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.request.DesignRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.DesignResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/designs")
@RequiredArgsConstructor
public class DesignController
        extends BaseController<DesignResponseDTO, DesignCriteria,
        DesignResponseDTO, DesignRequestDTO, Long> {
}
