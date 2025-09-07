package com.emhieulacloi.fashionstore.api.service;

import com.emhieulacloi.fashionstore.api.base.service.CustomCrudService;
import com.emhieulacloi.fashionstore.api.domains.criteria.ProductCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.request.ProductRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.ProductResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService
        extends CustomCrudService<ProductResponseDTO, ProductRequestDTO, Long> {
    Page<ProductResponseDTO> findAllByCriteria(ProductCriteria criteria, Pageable pageable);
    ProductResponseDTO findByQueryId(Long id);
}
