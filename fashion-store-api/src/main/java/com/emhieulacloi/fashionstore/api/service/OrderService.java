package com.emhieulacloi.fashionstore.api.service;

import com.emhieulacloi.fashionstore.api.base.service.CustomCrudService;
import com.emhieulacloi.fashionstore.api.domains.dto.request.OrderRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.OrderResponseDTO;

public interface OrderService
        extends CustomCrudService<OrderResponseDTO, OrderRequestDTO, Long> {
}
