package com.emhieulacloi.fashionstore.api.service;

import com.emhieulacloi.fashionstore.api.base.service.CustomCrudService;
import com.emhieulacloi.fashionstore.api.domains.dto.request.PaymentRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.PaymentResponseDTO;

public interface PaymentService
        extends CustomCrudService<PaymentResponseDTO, PaymentRequestDTO, Long> {
}
