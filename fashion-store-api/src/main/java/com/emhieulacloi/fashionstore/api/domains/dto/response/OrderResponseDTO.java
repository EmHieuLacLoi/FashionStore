package com.emhieulacloi.fashionstore.api.domains.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDTO {
    private Long id;

    @JsonProperty("code")
    private String code;
    
    @JsonProperty("user_id")
    private Long userId;
    
    @JsonProperty("user_name")
    private String userName;
    
    private Integer status;
    
    @JsonProperty("total_amount")
    private BigDecimal totalAmount;

    @JsonProperty("address")
    private String address;

    @JsonProperty("phone_number")
    private String phoneNumber;
    
    @JsonProperty("order_items")
    private List<OrderItemResponseDTO> orderItems;
    
    @JsonProperty("payment")
    private PaymentResponseDTO payment;

    @JsonProperty("created_by_id")
    private Long createdById;

    @JsonProperty("created_by")
    private String createdByName;

    @JsonProperty("created_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Timestamp createdAt;

    @JsonProperty("updated_by_id")
    private Long updatedById;

    @JsonProperty("updated_by")
    private String updatedByName;

    @JsonProperty("updated_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Timestamp updatedAt;
}
