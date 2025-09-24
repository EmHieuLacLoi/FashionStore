package com.emhieulacloi.fashionstore.api.service;

import com.emhieulacloi.fashionstore.api.base.service.CustomCrudService;
import com.emhieulacloi.fashionstore.api.domains.dto.request.ReviewRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.ReviewResponseDTO;

public interface ReviewService
        extends CustomCrudService<ReviewResponseDTO, ReviewRequestDTO, Long> {
}
