package com.emhieulacloi.fashionstore.api.service.query;

import com.emhieulacloi.fashionstore.api.base.service.BaseQueryService;
import com.emhieulacloi.fashionstore.api.domains.criteria.PaymentCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.PaymentDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.PaymentResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Payment;
import com.emhieulacloi.fashionstore.api.repository.PaymentRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class PaymentQueryService extends BaseQueryService<PaymentResponseDTO, PaymentCriteria, Long, Payment, PaymentDTO> {

    public PaymentQueryService(PaymentRepository repository, ModelMapper modelMapper) {
        super(repository, modelMapper, PaymentResponseDTO.class);
    }
}
