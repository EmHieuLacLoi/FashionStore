package com.emhieulacloi.fashionstore.api.service.mapper;

import com.emhieulacloi.fashionstore.api.base.mapper.BaseMapper;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.DesignDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.request.DesignRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.DesignResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Design;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DesignMapper
        extends BaseMapper<DesignDTO, Design, DesignRequestDTO, DesignResponseDTO> {
}
