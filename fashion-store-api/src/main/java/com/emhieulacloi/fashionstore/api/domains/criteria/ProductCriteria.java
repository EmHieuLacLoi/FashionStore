package com.emhieulacloi.fashionstore.api.domains.criteria;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductCriteria extends BaseCriteria {
    private String name;
    private String description;
    private Long categoryId;
    private String categoryName;
    private BigDecimal priceFrom;
    private BigDecimal priceTo;
    private Integer stockQuantityFrom;
    private Integer stockQuantityTo;
    private Boolean inStock;
    private String sku;
}
