package com.emhieulacloi.fashionstore.api.domains.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemRequestDTO {
    private Long id;

    @JsonProperty("order_id")
    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Product ID is required")
    @JsonProperty("product_id")
    private Long productId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotNull(message = "Unit price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Unit price must be greater than 0")
    @JsonProperty("unit_price")
    private BigDecimal unitPrice;

    @NotNull(message = "Total price is required")
    @DecimalMin(value = "0.0", message = "Total price cannot be negative")
    @JsonProperty("total_price")
    private BigDecimal totalPrice;
}
