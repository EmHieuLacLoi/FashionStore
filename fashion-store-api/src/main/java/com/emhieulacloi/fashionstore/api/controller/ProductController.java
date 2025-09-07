package com.emhieulacloi.fashionstore.api.controller;

import com.emhieulacloi.fashionstore.api.base.controller.BaseController;
import com.emhieulacloi.fashionstore.api.common.component.ResponseDataConfiguration;
import com.emhieulacloi.fashionstore.api.domains.criteria.ProductCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.request.ProductRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.ProductResponseDTO;
import com.emhieulacloi.fashionstore.api.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController 
        extends BaseController<ProductResponseDTO, ProductCriteria, 
                ProductResponseDTO, ProductRequestDTO, Long> {
    private final ProductService productService;

    @Override
    @GetMapping
    public ResponseEntity<Page<ProductResponseDTO>> getAll(@ModelAttribute ProductCriteria request, Pageable pageable) {
        ResponseEntity<Page<ProductResponseDTO>> response;
        try {
            response = ResponseDataConfiguration.success(productService.findAllByCriteria(request, pageable));
        } catch (Exception ex) {
            response = ResponseDataConfiguration.handleResponseException(ex);
        }
        return response;
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getById(@PathVariable Long id) {
        ResponseEntity<ProductResponseDTO> response;
        try {
            response = ResponseDataConfiguration.success(productService.findByQueryId(id));
        } catch (Exception ex) {
            response = ResponseDataConfiguration.handleResponseException(ex);
        }
        return response;
    }
}
