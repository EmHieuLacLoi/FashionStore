package com.emhieulacloi.fashionstore.api.service.impl;

import com.emhieulacloi.fashionstore.api.auth.AuthUtils;
import com.emhieulacloi.fashionstore.api.common.component.MessageResource;
import com.emhieulacloi.fashionstore.api.common.exception.CommonException;
import com.emhieulacloi.fashionstore.api.domains.dto.request.ReviewRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.ReviewResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Review;
import com.emhieulacloi.fashionstore.api.enums.SystemCodeEnum;
import com.emhieulacloi.fashionstore.api.repository.ReviewRepository;
import com.emhieulacloi.fashionstore.api.service.ReviewService;
import com.emhieulacloi.fashionstore.api.service.mapper.ReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final MessageResource messageResource;

    @Override
    public ReviewResponseDTO save(ReviewRequestDTO dto) {
        Long currentCustomerId = AuthUtils.getCurrentUserId();

        Review review = reviewMapper.toEntity(dto);
        review.setCustomerId(currentCustomerId);

        Review savedReview = reviewRepository.save(review);

        return reviewMapper.entityToResponse(savedReview);
    }

    @Override
    public ReviewResponseDTO update(Long id, ReviewRequestDTO dto) {
        Long currentCustomerId = AuthUtils.getCurrentUserId();

        Review existingReview = reviewRepository.findById(id)
                .orElseThrow(() -> new CommonException()
                        .setErrorCode(SystemCodeEnum.ERROR_005.getCode(), messageResource)
                        .setStatusCode(HttpStatus.BAD_REQUEST));

        if (!existingReview.getCustomerId().equals(currentCustomerId)) {
            throw new CommonException()
                    .setErrorCode("review.not.owner", messageResource)
                    .setStatusCode(HttpStatus.FORBIDDEN);
        }

        Review updatedReview = reviewMapper.toEntity(dto);
        updatedReview.setId(existingReview.getId());

        updatedReview.setProductId(existingReview.getProductId());
        updatedReview.setCustomerId(existingReview.getCustomerId());

        Review updated = reviewRepository.save(updatedReview);

        return reviewMapper.entityToResponse(updated);
    }

    @Override
    public Integer delete(Long id) {
        Long currentCustomerId = AuthUtils.getCurrentUserId();

        Review existingReview = reviewRepository.findById(id)
                .orElseThrow(() -> new CommonException()
                        .setErrorCode(SystemCodeEnum.ERROR_005.getCode(), messageResource)
                        .setStatusCode(HttpStatus.BAD_REQUEST));

        if (!existingReview.getCustomerId().equals(currentCustomerId)) {
            throw new CommonException()
                    .setErrorCode("review.not.owner", messageResource)
                    .setStatusCode(HttpStatus.FORBIDDEN);
        }

        reviewRepository.deleteById(id);

        return 1;
    }
}
