package com.emhieulacloi.fashionstore.api.domains.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantRequestDTO {
    private Long id;

    @JsonProperty("product_id")
    @Min(value = 0, message = "Product ID must be greater than or equal to 0")
    @NotNull(message = "Product ID must not be null")
    private Long productId;

    @JsonProperty("color")
    @Size(min = 1, max = 50, message = "Color must be between 1 and 50 characters")
    @NotNull(message = "Color must not be null")
    private String color;

    @JsonProperty("size")
    @Size(min = 1, max = 50, message = "Size must be between 1 and 50 characters")
    @NotNull(message = "Size must not be null")
    private String size;

    @JsonProperty("stock_quantity")
    @Min(value = 0, message = "Stock quantity must be greater than or equal to 0")
    private Integer stockQuantity;
}
