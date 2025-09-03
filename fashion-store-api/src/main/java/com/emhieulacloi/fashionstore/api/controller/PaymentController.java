package com.emhieulacloi.fashionstore.api.controller;

import com.emhieulacloi.fashionstore.api.base.controller.BaseController;
import com.emhieulacloi.fashionstore.api.domains.criteria.PaymentCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.request.PaymentRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.PaymentResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController
        extends BaseController<PaymentResponseDTO, PaymentCriteria,
                PaymentResponseDTO, PaymentRequestDTO, Long> {
}
