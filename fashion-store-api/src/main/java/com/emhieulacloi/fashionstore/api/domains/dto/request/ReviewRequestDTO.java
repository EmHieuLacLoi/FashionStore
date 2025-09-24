package com.emhieulacloi.fashionstore.api.domains.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequestDTO {
    private Long id;

    @NotNull(message = "Product ID is required")
    @JsonProperty("product_id")
    private Long productId;

    @JsonProperty("customer_id")
    private Long customerId;

    @NotNull(message = "Comment is required")
    @JsonProperty("comment")
    private String comment;
}
