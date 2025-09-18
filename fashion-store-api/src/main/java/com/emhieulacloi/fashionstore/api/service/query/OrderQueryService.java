package com.emhieulacloi.fashionstore.api.service.query;

import com.emhieulacloi.fashionstore.api.base.service.BaseQueryService;
import com.emhieulacloi.fashionstore.api.domains.criteria.OrderCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.OrderDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.OrderResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Order;
import com.emhieulacloi.fashionstore.api.repository.OrderRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class OrderQueryService extends BaseQueryService<OrderResponseDTO, OrderCriteria, Long, Order, OrderDTO> {

    public OrderQueryService(OrderRepository repository, ModelMapper modelMapper) {
        super(repository, modelMapper, OrderResponseDTO.class);
    }
}
