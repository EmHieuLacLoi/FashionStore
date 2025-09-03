package com.emhieulacloi.fashionstore.api.domains.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDTO {
    private Long id;

    @NotNull(message = "User ID is required")
    @JsonProperty("user_id")
    private Long userId;

    @NotNull(message = "Status is required")
    @Min(value = 0, message = "Status cannot be negative")
    @Max(value = 4, message = "Status cannot be greater than 4")
    private Integer status;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.0", message = "Total amount cannot be negative")
    @JsonProperty("total_amount")
    private BigDecimal totalAmount;

    @Valid
    @NotNull(message = "Order items are required")
    @JsonProperty("order_items")
    private List<OrderItemRequestDTO> orderItems;
}
