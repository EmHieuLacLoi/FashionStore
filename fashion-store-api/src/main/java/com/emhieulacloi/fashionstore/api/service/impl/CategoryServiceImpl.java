package com.emhieulacloi.fashionstore.api.service.impl;

import com.emhieulacloi.fashionstore.api.domains.dto.request.CategoryRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.CategoryResponseDTO;
import com.emhieulacloi.fashionstore.api.service.CategoryService;
import org.springframework.stereotype.Service;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Override
    public CategoryResponseDTO save(CategoryRequestDTO dto) {
        return null;
    }

    @Override
    public CategoryResponseDTO update(Long aLong, CategoryRequestDTO dto) {
        return null;
    }

    @Override
    public Integer delete(Long aLong) {
        return 0;
    }
}
