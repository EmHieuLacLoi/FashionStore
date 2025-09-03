package com.emhieulacloi.fashionstore.api.service.mapper;

import com.emhieulacloi.fashionstore.api.base.mapper.BaseMapper;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.OrderDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.request.OrderRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.OrderResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Order;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderMapper extends BaseMapper<OrderDTO, Order, OrderRequestDTO, OrderResponseDTO> {
}
