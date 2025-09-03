package com.emhieulacloi.fashionstore.api.service.query;

import com.emhieulacloi.fashionstore.api.base.service.BaseQueryService;
import com.emhieulacloi.fashionstore.api.domains.criteria.ProductCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.response.ProductResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Product;
import com.emhieulacloi.fashionstore.api.repository.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class ProductQueryService extends BaseQueryService<ProductResponseDTO, ProductCriteria, Long, Product> {

    public ProductQueryService(ProductRepository repository, ModelMapper modelMapper) {
        super(repository, modelMapper, ProductResponseDTO.class);
    }
}
