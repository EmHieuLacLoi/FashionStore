package com.emhieulacloi.fashionstore.api.domains.dto.projection;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.sql.Timestamp;

public interface OrderItemDTO {
    @JsonProperty("id")
    Long getId();
    
    @JsonProperty("order_id")
    Long getOrderId();
    
    @JsonProperty("product_id")
    Long getProductId();
    
    @JsonProperty("product_name")
    String getProductName();
    
    @JsonProperty("quantity")
    Integer getQuantity();
    
    @JsonProperty("unit_price")
    BigDecimal getUnitPrice();
    
    @JsonProperty("total_price")
    BigDecimal getTotalPrice();
    
    @JsonProperty("created_by_id")
    Long getCreatedById();
    
    @JsonProperty("created_by")
    String getCreatedByName();
    
    @JsonProperty("created_at")
    Timestamp getCreatedAt();
    
    @JsonProperty("updated_by_id")
    Long getUpdatedById();
    
    @JsonProperty("updated_by")
    String getUpdatedByName();
    
    @JsonProperty("updated_at")
    Timestamp getUpdatedAt();
}
