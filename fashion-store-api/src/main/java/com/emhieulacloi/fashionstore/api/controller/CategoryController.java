package com.emhieulacloi.fashionstore.api.controller;

import com.emhieulacloi.fashionstore.api.base.controller.BaseController;
import com.emhieulacloi.fashionstore.api.domains.criteria.CategoryCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.request.CategoryRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.CategoryResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController
        extends BaseController<CategoryResponseDTO, CategoryCriteria,
                CategoryResponseDTO, CategoryRequestDTO, Long> {
}
