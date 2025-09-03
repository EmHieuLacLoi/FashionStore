package com.emhieulacloi.fashionstore.api.controller;

import com.emhieulacloi.fashionstore.api.base.controller.BaseController;
import com.emhieulacloi.fashionstore.api.domains.criteria.ProductCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.request.ProductRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.ProductResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController 
        extends BaseController<ProductResponseDTO, ProductCriteria, 
                ProductResponseDTO, ProductRequestDTO, Long> {
}
