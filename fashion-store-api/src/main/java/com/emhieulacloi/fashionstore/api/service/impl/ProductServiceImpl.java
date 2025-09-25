package com.emhieulacloi.fashionstore.api.service.impl;

import com.emhieulacloi.fashionstore.api.common.component.MessageResource;
import com.emhieulacloi.fashionstore.api.common.exception.CommonException;
import com.emhieulacloi.fashionstore.api.domains.criteria.ProductCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.ProductDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.request.ProductRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.request.ProductVariantRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.ProductResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Product;
import com.emhieulacloi.fashionstore.api.domains.entity.ProductVariant;
import com.emhieulacloi.fashionstore.api.enums.SystemCodeEnum;
import com.emhieulacloi.fashionstore.api.repository.CategoryRepository;
import com.emhieulacloi.fashionstore.api.repository.OrderItemRepository;
import com.emhieulacloi.fashionstore.api.repository.ProductRepository;
import com.emhieulacloi.fashionstore.api.repository.ProductVariantRepository;
import com.emhieulacloi.fashionstore.api.service.ProductService;
import com.emhieulacloi.fashionstore.api.service.mapper.ProductMapper;
import com.emhieulacloi.fashionstore.api.service.mapper.ProductVariantMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductMapper productMapper;
    private final ProductVariantMapper productVariantMapper;
    private final MessageResource messageResource;
    private final CategoryRepository categoryRepository;
    private final OrderItemRepository orderItemRepository;


    @Override
    public Page<ProductResponseDTO> findAllByCriteria(ProductCriteria criteria, Pageable pageable) {
        Page<ProductDTO> productDTOS = productRepository.findAllByCriteria(criteria, pageable);
        List<Long> productIds = productDTOS.getContent().stream().map(ProductDTO::getId).toList();
        List<ProductVariant> productVariants = productVariantRepository.findAllByProductIdIn(productIds);

        List<ProductResponseDTO> productResponseDTOS = productDTOS
                .getContent().stream().map(productMapper::dtoToResponse).toList();

        productResponseDTOS.forEach(productResponseDTO -> {
            List<ProductVariant> variantsForProduct = productVariants.stream()
                    .filter(productVariant ->
                            productVariant.getProductId().equals(productResponseDTO.getId()))
                    .toList();
            productResponseDTO.setVariants(variantsForProduct.stream()
                    .map(productVariantMapper::entityToResponse).toList());
        });

        return new PageImpl<>(productResponseDTOS, pageable, productDTOS.getTotalElements());
    }

    @Override
    public ProductResponseDTO findByQueryId(Long id) {
        ProductDTO productDTO = productRepository.findByQueryId(id).orElseThrow(() -> new CommonException()
                .setErrorCode(SystemCodeEnum.ERROR_005.getCode(), messageResource)
                .setStatusCode(HttpStatus.BAD_REQUEST));

        ProductResponseDTO productResponseDTO = productMapper.dtoToResponse(productDTO);

        List<ProductVariant> productVariants = productVariantRepository.findAllByProductId(productResponseDTO.getId());

        productResponseDTO.setVariants(productVariants.stream().map(productVariantMapper::entityToResponse).toList());
        return productResponseDTO;
    }

    @Override
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    public ProductResponseDTO save(ProductRequestDTO dto) {
        ProductRequestDTO dtoSetDefault = validateAndSetDefautltProduct(dto);

        Product product = productMapper.toEntity(dtoSetDefault);
        Product savedProduct = productRepository.save(product);

        saveProductVariants(dtoSetDefault, savedProduct.getId());

        return productMapper.entityToResponse(savedProduct);
    }

    @Override
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    public ProductResponseDTO update(Long id, ProductRequestDTO dto) {
        ProductRequestDTO dtoSetDefault = validateAndSetDefautltProduct(dto);

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new CommonException()
                        .setErrorCode(SystemCodeEnum.ERROR_005.getCode(), messageResource)
                        .setStatusCode(HttpStatus.BAD_REQUEST));

        Product updatedProduct = productMapper.toEntity(dtoSetDefault);
        updatedProduct.setId(existingProduct.getId());
        Product updated = productRepository.save(updatedProduct);

        saveProductVariants(dtoSetDefault, updatedProduct.getId());

        return productMapper.entityToResponse(updated);
    }

    @Override
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    public Integer delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new CommonException()
                    .setErrorCode(SystemCodeEnum.ERROR_005.getCode(), messageResource)
                    .setStatusCode(HttpStatus.BAD_REQUEST);
        }

        productVariantRepository.deleteByProductId(id);

        productRepository.deleteById(id);
        return 1;
    }

    private ProductRequestDTO validateAndSetDefautltProduct(ProductRequestDTO dto) {
        if (dto.getCategoryId() != null && !categoryRepository.existsById(dto.getCategoryId())) {
            throw  new CommonException()
                    .setErrorCode(SystemCodeEnum.ERROR_005.getCode(), messageResource)
                    .setStatusCode(HttpStatus.BAD_REQUEST);
        }

        if (dto.getStockQuantity() == null) {
            dto.setStockQuantity(0);
        }
        return dto;
    }

    private void saveProductVariants(ProductRequestDTO dto, Long productId) {
        List<ProductVariant> existingVariants = productVariantRepository.findAllByProductId(productId);

        Map<String, ProductVariant> existingMap = existingVariants.stream()
                .collect(Collectors.toMap(
                        v -> v.getColor() + "_" + v.getSize(),
                        v -> v
                ));

        List<ProductVariant> toSave = new ArrayList<>();

        if (dto.getVariants() != null) {
            for (ProductVariantRequestDTO variantDto : dto.getVariants()) {
                String key = variantDto.getColor() + "_" + variantDto.getSize();

                if (existingMap.containsKey(key)) {
                    ProductVariant existing = existingMap.get(key);
                    existing.setStockQuantity(
                            variantDto.getStockQuantity() == null ? 0 : variantDto.getStockQuantity()
                    );
                    toSave.add(existing);

                    existingMap.remove(key);
                } else {
                    ProductVariant newVariant = productVariantMapper.toEntity(variantDto);
                    newVariant.setProductId(productId);
                    if (newVariant.getStockQuantity() == null) {
                        newVariant.setStockQuantity(0);
                    }
                    toSave.add(newVariant);
                }
            }
        }

        for (ProductVariant toDelete : existingMap.values()) {
            boolean existsInOrders = orderItemRepository.existsByProductVariantId(toDelete.getId());
            if (existsInOrders) {
                throw new CommonException()
                        .setErrorCode(SystemCodeEnum.ERROR_011.getCode(), messageResource)
                        .setStatusCode(HttpStatus.BAD_REQUEST);
            }
            productVariantRepository.delete(toDelete);
        }

        if (!toSave.isEmpty()) {
            productVariantRepository.saveAll(toSave);
        }
    }
}

