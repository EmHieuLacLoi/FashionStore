package com.emhieulacloi.fashionstore.api.domains.criteria;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class OrderCriteria {
    private String code;

    private String fullName;

    private BigDecimal minPrice;

    private BigDecimal maxPrice;

    private Integer status;

    public String getCode() {
        return code == null || code.isEmpty() ? null : "%" + code.trim() + "%";
    }

    public String getFullName() {
        return fullName == null || fullName.isEmpty() ? null : "%" + fullName.trim() + "%";
    }
}
