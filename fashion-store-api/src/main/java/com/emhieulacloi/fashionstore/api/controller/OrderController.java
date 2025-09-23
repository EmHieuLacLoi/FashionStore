package com.emhieulacloi.fashionstore.api.controller;

import com.emhieulacloi.fashionstore.api.base.controller.BaseController;
import com.emhieulacloi.fashionstore.api.common.component.ResponseDataConfiguration;
import com.emhieulacloi.fashionstore.api.domains.criteria.OrderCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.request.OrderRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.OrderResponseDTO;
import com.emhieulacloi.fashionstore.api.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController
        extends BaseController<OrderResponseDTO, OrderCriteria,
                OrderResponseDTO, OrderRequestDTO, Long> {
    private final OrderService orderService;

    @Override
    @GetMapping
    public ResponseEntity<Page<OrderResponseDTO>> getAll(@ModelAttribute OrderCriteria request, Pageable pageable) {
        ResponseEntity<Page<OrderResponseDTO>> response;
        try {
            response = ResponseDataConfiguration.success(orderService.findAllByCriteria(request, pageable));
        } catch (Exception ex) {
            response = ResponseDataConfiguration.handleResponseException(ex);
        }
        return response;
    }
}
