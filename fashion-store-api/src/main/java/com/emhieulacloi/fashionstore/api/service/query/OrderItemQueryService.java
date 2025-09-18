package com.emhieulacloi.fashionstore.api.service.query;

import com.emhieulacloi.fashionstore.api.base.service.BaseQueryService;
import com.emhieulacloi.fashionstore.api.domains.criteria.OrderItemCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.OrderItemDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.OrderItemResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.OrderItem;
import com.emhieulacloi.fashionstore.api.repository.OrderItemRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class OrderItemQueryService
        extends BaseQueryService<OrderItemResponseDTO, OrderItemCriteria, Long, OrderItem, OrderItemDTO> {

    public OrderItemQueryService(OrderItemRepository repository, ModelMapper modelMapper) {
        super(repository, modelMapper, OrderItemResponseDTO.class);
    }
}
