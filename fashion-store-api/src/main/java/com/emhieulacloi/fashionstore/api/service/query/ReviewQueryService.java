package com.emhieulacloi.fashionstore.api.service.query;

import com.emhieulacloi.fashionstore.api.base.repository.QueryRepository;
import com.emhieulacloi.fashionstore.api.base.service.BaseQueryService;
import com.emhieulacloi.fashionstore.api.domains.criteria.ReviewCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.ReviewDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.ReviewResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Review;
import com.emhieulacloi.fashionstore.api.repository.ReviewRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class ReviewQueryService
        extends BaseQueryService<ReviewResponseDTO, ReviewCriteria, Long, Review, ReviewDTO> {

    public ReviewQueryService(ReviewRepository repository, ModelMapper modelMapper) {
        super(repository, modelMapper, ReviewResponseDTO.class);
    }
}
