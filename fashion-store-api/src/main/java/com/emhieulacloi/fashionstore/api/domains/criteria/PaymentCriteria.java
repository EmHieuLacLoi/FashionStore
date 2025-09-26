package com.emhieulacloi.fashionstore.api.domains.criteria;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PaymentCriteria {
    private String orderCode;
    private Integer paymentMethod;
    private Integer status;
    private BigDecimal maxAmount;
    private BigDecimal minAmount;

    public String getOrderCode() {
        return orderCode == null || orderCode.isEmpty() ? null : "%" + orderCode.trim() + "%";
    }

}
