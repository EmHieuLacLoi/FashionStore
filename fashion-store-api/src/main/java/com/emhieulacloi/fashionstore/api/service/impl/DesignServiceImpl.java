package com.emhieulacloi.fashionstore.api.service.impl;

import com.emhieulacloi.fashionstore.api.auth.AuthUtils;
import com.emhieulacloi.fashionstore.api.common.component.MessageResource;
import com.emhieulacloi.fashionstore.api.common.exception.CommonException;
import com.emhieulacloi.fashionstore.api.domains.dto.request.DesignRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.DesignResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Design;
import com.emhieulacloi.fashionstore.api.domains.entity.OrderItem;
import com.emhieulacloi.fashionstore.api.enums.SystemCodeEnum;
import com.emhieulacloi.fashionstore.api.repository.DesignRepository;
import com.emhieulacloi.fashionstore.api.repository.OrderItemRepository;
import com.emhieulacloi.fashionstore.api.service.DesignService;
import com.emhieulacloi.fashionstore.api.service.mapper.DesignMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DesignServiceImpl implements DesignService {

    private final DesignRepository designRepository;
    private final OrderItemRepository orderItemRepository;
    private final DesignMapper designMapper;
    private final MessageResource messageResource;

    @Override
    public DesignResponseDTO save(DesignRequestDTO dto) {
        Long currentUserId = AuthUtils.getCurrentUserId();
        dto.setUserId(currentUserId);

        Design design = designMapper.toEntity(dto);

        Design savedDesign = designRepository.save(design);

        return designMapper.entityToResponse(savedDesign);
    }

    @Override
    public DesignResponseDTO update(Long id, DesignRequestDTO dto) {
        Long currentUserId = AuthUtils.getCurrentUserId();
        dto.setUserId(currentUserId);

        Design existingDesign = designRepository.findById(id)
                .orElseThrow(() -> new CommonException()
                        .setErrorCode(SystemCodeEnum.ERROR_005.getCode(), messageResource)
                        .setStatusCode(HttpStatus.BAD_REQUEST));

        Design updatedDesign = designMapper.toEntity(dto);
        updatedDesign.setId(existingDesign.getId());

        Design updated = designRepository.save(updatedDesign);

        return designMapper.entityToResponse(updated);
    }

    @Override
    public Integer delete(Long id) {
        if (!designRepository.existsById(id)) {
            throw new CommonException()
                    .setErrorCode(SystemCodeEnum.ERROR_005.getCode(), messageResource)
                    .setStatusCode(HttpStatus.BAD_REQUEST);
        }

        List<OrderItem> orderItems = orderItemRepository.findAllByDesignId(id);

        if (!orderItems.isEmpty()) {
            orderItems.forEach(item -> item.setDesignId(null));
            orderItemRepository.saveAll(orderItems);
        }

        designRepository.deleteById(id);

        return 1;
    }
}
