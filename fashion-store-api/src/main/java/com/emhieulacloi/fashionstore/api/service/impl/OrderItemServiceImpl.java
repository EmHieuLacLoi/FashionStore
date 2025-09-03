package com.emhieulacloi.fashionstore.api.service.impl;

import com.emhieulacloi.fashionstore.api.domains.dto.request.OrderItemRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.OrderItemResponseDTO;
import com.emhieulacloi.fashionstore.api.service.OrderItemService;
import org.springframework.stereotype.Service;

@Service
public class OrderItemServiceImpl implements OrderItemService {
    @Override
    public OrderItemResponseDTO save(OrderItemRequestDTO dto) {
        return null;
    }

    @Override
    public OrderItemResponseDTO update(Long aLong, OrderItemRequestDTO dto) {
        return null;
    }

    @Override
    public Integer delete(Long aLong) {
        return 0;
    }
}
