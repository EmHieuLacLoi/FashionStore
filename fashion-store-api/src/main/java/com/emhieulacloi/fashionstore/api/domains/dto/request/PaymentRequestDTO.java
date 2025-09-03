package com.emhieulacloi.fashionstore.api.domains.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDTO {
    private Long id;

    @NotNull(message = "Order ID is required")
    @JsonProperty("order_id")
    private Long orderId;

    @NotNull(message = "Payment method is required")
    @Min(value = 0, message = "Payment method cannot be negative")
    @Max(value = 3, message = "Payment method cannot be greater than 3")
    @JsonProperty("payment_method")
    private Integer paymentMethod;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", message = "Amount must be greater than 0")
    @JsonProperty("amount")
    private BigDecimal amount;

    @JsonProperty("payment_date")
    private Timestamp paymentDate;

    @NotNull(message = "Status is required")
    @Min(value = 0, message = "Status cannot be negative")
    @Max(value = 2, message = "Status cannot be greater than 2")
    @JsonProperty("status")
    private Integer status;
}
