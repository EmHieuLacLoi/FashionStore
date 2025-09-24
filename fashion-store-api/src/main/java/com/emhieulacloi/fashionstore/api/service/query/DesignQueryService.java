package com.emhieulacloi.fashionstore.api.service.query;

import com.emhieulacloi.fashionstore.api.base.service.BaseQueryService;
import com.emhieulacloi.fashionstore.api.domains.criteria.DesignCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.DesignDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.DesignResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Design;
import com.emhieulacloi.fashionstore.api.repository.DesignRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class DesignQueryService
        extends BaseQueryService<DesignResponseDTO, DesignCriteria, Long, Design, DesignDTO> {

    public DesignQueryService(DesignRepository repository, ModelMapper modelMapper) {
        super(repository, modelMapper, DesignResponseDTO.class);
    }
}
