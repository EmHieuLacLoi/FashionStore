package com.emhieulacloi.fashionstore.api.service.mapper;

import com.emhieulacloi.fashionstore.api.base.mapper.BaseMapper;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.OrderItemDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.request.OrderItemRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.OrderItemResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.OrderItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderItemMapper extends BaseMapper<OrderItemDTO, OrderItem, OrderItemRequestDTO, OrderItemResponseDTO> {
}
