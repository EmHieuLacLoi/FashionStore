package com.emhieulacloi.fashionstore.api.domains.dto.projection;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.sql.Timestamp;

public interface PaymentDTO {
    @JsonProperty("id")
    Long getId();
    
    @JsonProperty("order_id")
    Long getOrderId();

    @JsonProperty("order_code")
    String getOrderCode();

    @JsonProperty("order_status")
    Integer getOrderStatus();
    
    @JsonProperty("payment_method")
    Integer getPaymentMethod();
    
    @JsonProperty("amount")
    BigDecimal getAmount();
    
    @JsonProperty("payment_date")
    Timestamp getPaymentDate();
    
    @JsonProperty("status")
    Integer getStatus();
    
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
