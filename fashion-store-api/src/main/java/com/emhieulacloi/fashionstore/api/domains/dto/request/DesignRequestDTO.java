package com.emhieulacloi.fashionstore.api.domains.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DesignRequestDTO {
    private Long id;

    @NotNull(message = "User ID cannot be null")
    @JsonProperty("user_id")
    private Long userId;

    @NotNull(message = "Front image URL cannot be null")
    @JsonProperty("front_image_url")
    private String frontImageUrl;

    @NotNull(message = "Back image URL cannot be null")
    @JsonProperty("back_image_url")
    private String backImageUrl;
}
