package com.emhieulacloi.fashionstore.api.domains.dto.projection;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.sql.Timestamp;

public interface OrderDTO {
    @JsonProperty("id")
    Long getId();

    @JsonProperty("code")
    String getCode();

    @JsonProperty("user_id")
    Long getUserId();
    
    @JsonProperty("user_name")
    String getUserName();
    
    @JsonProperty("status")
    Integer getStatus();
    
    @JsonProperty("total_amount")
    BigDecimal getTotalAmount();

    @JsonProperty("address")
    String getAddress();

    @JsonProperty("phone_number")
    String getPhoneNumber();
    
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
