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
public class OrderItemResponseDTO {
    private Long id;
    
    @JsonProperty("order_id")
    private Long orderId;

    @JsonProperty("product_variant_id")
    private Long productVariantId;

    @JsonProperty("product_variant")
    private ProductVariantResponseDTO productVariant;
    
    @JsonProperty("product_name")
    private String productName;
    
    private Integer quantity;
    
    @JsonProperty("unit_price")
    private BigDecimal unitPrice;
    
    @JsonProperty("total_price")
    private BigDecimal totalPrice;

    @JsonProperty("design")
    private DesignResponseDTO design;

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
