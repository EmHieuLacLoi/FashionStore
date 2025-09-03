package com.emhieulacloi.fashionstore.api.domains.criteria;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class OrderItemCriteria extends BaseCriteria {
    private Long orderId;
    private Long productId;
    private String productName;
    private Integer quantityFrom;
    private Integer quantityTo;
    private BigDecimal priceFrom;
    private BigDecimal priceTo;
    private BigDecimal totalPriceFrom;
    private BigDecimal totalPriceTo;
}
