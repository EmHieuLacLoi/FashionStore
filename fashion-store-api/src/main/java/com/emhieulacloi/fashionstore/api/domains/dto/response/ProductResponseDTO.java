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
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    
    @JsonProperty("stock_quantity")
    private Integer stockQuantity;
    
    @JsonProperty("category_id")
    private Long categoryId;
    
    @JsonProperty("category_name")
    private String categoryName;
    
    @JsonProperty("image_url")
    private String imageUrl;

    @JsonProperty("variants")
    private List<ProductVariantResponseDTO> variants;

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
