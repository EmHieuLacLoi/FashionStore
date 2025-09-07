package com.emhieulacloi.fashionstore.api.service.mapper;

import com.emhieulacloi.fashionstore.api.base.mapper.BaseMapper;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.ProductVariantDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.request.ProductVariantRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.ProductVariantResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.ProductVariant;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductVariantMapper
        extends BaseMapper<ProductVariantDTO, ProductVariant, ProductVariantRequestDTO, ProductVariantResponseDTO> {
}
