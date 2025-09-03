package com.emhieulacloi.fashionstore.api.controller;

import com.emhieulacloi.fashionstore.api.base.controller.BaseController;
import com.emhieulacloi.fashionstore.api.domains.criteria.OrderCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.request.OrderRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.OrderResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController
        extends BaseController<OrderResponseDTO, OrderCriteria,
                OrderResponseDTO, OrderRequestDTO, Long> {
}
