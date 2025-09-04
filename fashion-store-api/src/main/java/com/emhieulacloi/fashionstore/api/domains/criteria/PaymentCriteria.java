package com.emhieulacloi.fashionstore.api.domains.criteria;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class PaymentCriteria {
    private Long orderId;
    private Integer paymentMethod;
    private Integer status;
    private BigDecimal amountFrom;
    private BigDecimal amountTo;
    private LocalDateTime paymentDateFrom;
    private LocalDateTime paymentDateTo;
    private String transactionId;
}
