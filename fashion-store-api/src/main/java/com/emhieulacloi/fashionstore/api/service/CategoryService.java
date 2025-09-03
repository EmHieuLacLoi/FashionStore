package com.emhieulacloi.fashionstore.api.service;

import com.emhieulacloi.fashionstore.api.base.service.CustomCrudService;
import com.emhieulacloi.fashionstore.api.domains.dto.request.CategoryRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.CategoryResponseDTO;

public interface CategoryService
        extends CustomCrudService<CategoryResponseDTO, CategoryRequestDTO, Long> {
}
