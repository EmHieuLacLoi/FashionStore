package com.emhieulacloi.fashionstore.api.domains.criteria;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class OrderCriteria {
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String shippingAddress;
    private String orderCode;
    private Integer status;
    private BigDecimal totalAmountFrom;
    private BigDecimal totalAmountTo;
    private LocalDateTime orderDateFrom;
    private LocalDateTime orderDateTo;
}
