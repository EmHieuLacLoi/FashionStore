package com.emhieulacloi.fashionstore.api.domains.dto.projection;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.Timestamp;

public interface UserDTO {
    @JsonProperty("id")
    Long getId();
    
    @JsonProperty("username")
    String getUsername();
    
    @JsonProperty("email")
    String getEmail();
    
    @JsonProperty("full_name")
    String getFullName();
    
    @JsonProperty("phone_number")
    String getPhoneNumber();
    
    @JsonProperty("status")
    Integer getStatus();
    
    @JsonProperty("address")
    String getAddress();

    @JsonProperty("createdById")
    Long getCreatedById();

    @JsonProperty("createdByName")
    String getCreatedByName();

    @JsonProperty("updatedById")
    Long getUpdatedById();

    @JsonProperty("updatedByName")
    String getUpdatedByName();

    @JsonProperty("createdAt")
    Timestamp getCreatedAt();

    @JsonProperty("updatedAt")
    Timestamp getUpdatedAt();
}
