package com.emhieulacloi.fashionstore.api.controller;

import com.emhieulacloi.fashionstore.api.base.controller.BaseController;
import com.emhieulacloi.fashionstore.api.domains.criteria.OrderItemCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.request.OrderItemRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.OrderItemResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/order-items")
@RequiredArgsConstructor
public class OrderItemController
        extends BaseController<OrderItemResponseDTO, OrderItemCriteria,
                OrderItemResponseDTO, OrderItemRequestDTO, Long> {
}
