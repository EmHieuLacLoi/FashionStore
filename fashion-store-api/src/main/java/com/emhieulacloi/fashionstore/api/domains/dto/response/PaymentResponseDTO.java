package com.emhieulacloi.fashionstore.api.domains.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDTO {
    private Long id;
    
    @JsonProperty("order_id")
    private Long orderId;

    @JsonProperty("order_code")
    private String orderCode;

    @JsonProperty("order_status")
    private Integer orderStatus;
    
    @JsonProperty("payment_method")
    private Integer paymentMethod;
    
    private BigDecimal amount;
    
    @JsonProperty("payment_date")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Timestamp paymentDate;
    
    private Integer status;

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
