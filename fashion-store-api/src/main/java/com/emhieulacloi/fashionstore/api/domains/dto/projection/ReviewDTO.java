package com.emhieulacloi.fashionstore.api.domains.dto.projection;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.Timestamp;

public interface ReviewDTO {
    @JsonProperty("id")
    Long getId();

    @JsonProperty("product_id")
    Long getProductId();

    @JsonProperty("product_name")
    String getProductName();

    @JsonProperty("customer_id")
    Long getCustomerId();

    @JsonProperty("customer_name")
    String getCustomerName();

    @JsonProperty("comment")
    String getComment();

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
