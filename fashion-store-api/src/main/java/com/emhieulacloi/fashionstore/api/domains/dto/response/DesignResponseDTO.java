package com.emhieulacloi.fashionstore.api.domains.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DesignResponseDTO {
    private Long id;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("front_image_url")
    private String frontImageUrl;

    @JsonProperty("back_image_url")
    private String backImageUrl;
}
