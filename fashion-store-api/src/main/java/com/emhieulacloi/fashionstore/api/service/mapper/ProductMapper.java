package com.emhieulacloi.fashionstore.api.service.mapper;

import com.emhieulacloi.fashionstore.api.base.mapper.BaseMapper;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.ProductDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.request.ProductRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.ProductResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Product;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductMapper extends BaseMapper<ProductDTO, Product, ProductRequestDTO, ProductResponseDTO> {
}
