package com.emhieulacloi.fashionstore.api.domains.dto.projection;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.sql.Timestamp;

public interface ProductDTO {
    @JsonProperty("id")
    Long getId();
    
    @JsonProperty("name")
    String getName();
    
    @JsonProperty("description")
    String getDescription();
    
    @JsonProperty("price")
    BigDecimal getPrice();
    
    @JsonProperty("stock_quantity")
    Integer getStockQuantity();
    
    @JsonProperty("category_id")
    Long getCategoryId();
    
    @JsonProperty("category_name")
    String getCategoryName();
    
    @JsonProperty("image_url")
    String getImageUrl();
    
    @JsonProperty("created_by_id")
    Long getCreatedById();
    
    @JsonProperty("created_by")
    String getCreatedByName();
    
    @JsonProperty("created_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    Timestamp getCreatedAt();
    
    @JsonProperty("updated_by_id")
    Long getUpdatedById();
    
    @JsonProperty("updated_by")
    String getUpdatedByName();
    
    @JsonProperty("updated_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    Timestamp getUpdatedAt();
}
