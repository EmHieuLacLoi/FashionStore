package com.emhieulacloi.fashionstore.api.controller;

import com.emhieulacloi.fashionstore.api.base.controller.BaseController;
import com.emhieulacloi.fashionstore.api.domains.criteria.ReviewCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.request.ReviewRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.ReviewResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController
        extends BaseController<ReviewResponseDTO, ReviewCriteria,
        ReviewResponseDTO, ReviewRequestDTO, Long> {
}
