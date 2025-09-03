package com.emhieulacloi.fashionstore.api.service.impl;

import com.emhieulacloi.fashionstore.api.domains.dto.request.OrderRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.OrderResponseDTO;
import com.emhieulacloi.fashionstore.api.service.OrderService;
import org.springframework.stereotype.Service;

@Service
public class OrderServiceImpl
        implements OrderService {
    @Override
    public OrderResponseDTO save(OrderRequestDTO dto) {
        return null;
    }

    @Override
    public OrderResponseDTO update(Long aLong, OrderRequestDTO dto) {
        return null;
    }

    @Override
    public Integer delete(Long aLong) {
        return 0;
    }
}
