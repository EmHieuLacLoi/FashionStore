package com.emhieulacloi.fashionstore.api.service.mapper;

import com.emhieulacloi.fashionstore.api.base.mapper.BaseMapper;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.CategoryDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.request.CategoryRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.CategoryResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper extends BaseMapper<CategoryDTO, Category, CategoryRequestDTO, CategoryResponseDTO> {
}
