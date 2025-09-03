package com.emhieulacloi.fashionstore.api.service.impl;

import com.emhieulacloi.fashionstore.api.domains.dto.request.ProductRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.ProductResponseDTO;
import com.emhieulacloi.fashionstore.api.service.ProductService;
import org.springframework.stereotype.Service;

@Service
public class ProductServiceImpl
        implements ProductService {
    @Override
    public ProductResponseDTO save(ProductRequestDTO dto) {
        return null;
    }

    @Override
    public ProductResponseDTO update(Long aLong, ProductRequestDTO dto) {
        return null;
    }

    @Override
    public Integer delete(Long aLong) {
        return 0;
    }
}
