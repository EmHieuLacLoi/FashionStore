package com.emhieulacloi.fashionstore.api.domains.dto.response;

import java.util.Set;

public record LoginResponseDTO(
        String username,
        String token,
        Set<String> roles) {

}
