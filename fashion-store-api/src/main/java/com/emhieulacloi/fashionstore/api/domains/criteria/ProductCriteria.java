package com.emhieulacloi.fashionstore.api.domains.criteria;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductCriteria {
    private String name;

    private BigDecimal minPrice;

    private BigDecimal maxPrice;

    private Boolean inStock;

    public String getName() {
        return name == null || name.isEmpty() ? null : "%" + name.trim() + "%";
    }
}
