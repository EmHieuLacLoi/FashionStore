package com.emhieulacloi.fashionstore.api.service.query;

import com.emhieulacloi.fashionstore.api.base.service.BaseQueryService;
import com.emhieulacloi.fashionstore.api.domains.criteria.CategoryCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.CategoryDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.CategoryResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Category;
import com.emhieulacloi.fashionstore.api.repository.CategoryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class CategoryQueryService
        extends BaseQueryService<CategoryResponseDTO, CategoryCriteria, Long, Category, CategoryDTO> {

    public CategoryQueryService(CategoryRepository repository, ModelMapper modelMapper) {
        super(repository, modelMapper, CategoryResponseDTO.class);
    }
}
