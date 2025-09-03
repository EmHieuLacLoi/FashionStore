package com.emhieulacloi.fashionstore.api.service.mapper;

import com.emhieulacloi.fashionstore.api.base.mapper.BaseMapper;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.PaymentDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.request.PaymentRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.PaymentResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Payment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaymentMapper extends BaseMapper<PaymentDTO, Payment, PaymentRequestDTO, PaymentResponseDTO> {
}
