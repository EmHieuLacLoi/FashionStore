package com.emhieulacloi.fashionstore.api.service;

import com.emhieulacloi.fashionstore.api.base.service.CustomCrudService;
import com.emhieulacloi.fashionstore.api.domains.dto.request.OrderItemRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.OrderItemResponseDTO;

public interface OrderItemService
        extends CustomCrudService<OrderItemResponseDTO, OrderItemRequestDTO, Long> {
}
