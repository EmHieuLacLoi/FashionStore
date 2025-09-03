package com.emhieulacloi.fashionstore.api.service.impl;

import com.emhieulacloi.fashionstore.api.domains.dto.request.PaymentRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.PaymentResponseDTO;
import com.emhieulacloi.fashionstore.api.service.PaymentService;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl
        implements PaymentService {
    @Override
    public PaymentResponseDTO save(PaymentRequestDTO dto) {
        return null;
    }

    @Override
    public PaymentResponseDTO update(Long aLong, PaymentRequestDTO dto) {
        return null;
    }

    @Override
    public Integer delete(Long aLong) {
        return 0;
    }
}
