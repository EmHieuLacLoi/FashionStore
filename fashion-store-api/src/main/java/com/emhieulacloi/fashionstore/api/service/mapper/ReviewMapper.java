package com.emhieulacloi.fashionstore.api.service.mapper;

import com.emhieulacloi.fashionstore.api.base.mapper.BaseMapper;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.ReviewDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.request.ReviewRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.ReviewResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Review;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReviewMapper
        extends BaseMapper<ReviewDTO, Review, ReviewRequestDTO, ReviewResponseDTO> {
}
