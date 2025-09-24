package com.emhieulacloi.fashionstore.api.domains.dto.projection;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.Timestamp;

public interface DesignDTO {
    @JsonProperty("id")
    Long getId();

    @JsonProperty("user_id")
    Long getUserId();

    @JsonProperty("front_image_url")
    String getFrontImageUrl();

    @JsonProperty("back_image_url")
    String getBackImageUrl();

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
