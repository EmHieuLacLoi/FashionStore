package com.emhieulacloi.fashionstore.api.service;

import com.emhieulacloi.fashionstore.api.base.service.CustomCrudService;
import com.emhieulacloi.fashionstore.api.domains.dto.request.DesignRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.DesignResponseDTO;

public interface DesignService
        extends CustomCrudService<DesignResponseDTO, DesignRequestDTO, Long> {
}
