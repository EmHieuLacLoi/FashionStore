package com.emhieulacloi.fashionstore.api.service.impl;

import com.emhieulacloi.fashionstore.api.common.component.MessageResource;
import com.emhieulacloi.fashionstore.api.common.exception.CommonException;
import com.emhieulacloi.fashionstore.api.domains.dto.request.CategoryRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.CategoryResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Category;
import com.emhieulacloi.fashionstore.api.domains.entity.Product;
import com.emhieulacloi.fashionstore.api.enums.SystemCodeEnum;
import com.emhieulacloi.fashionstore.api.repository.CategoryRepository;
import com.emhieulacloi.fashionstore.api.repository.ProductRepository;
import com.emhieulacloi.fashionstore.api.service.CategoryService;
import com.emhieulacloi.fashionstore.api.service.mapper.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final MessageResource messageResource;
    private final CategoryMapper categoryMapper;
    private final ProductRepository productRepository;

    @Override
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    public CategoryResponseDTO save(CategoryRequestDTO dto) {
        if (categoryRepository.existsByName(dto.getName())) {
            throw new CommonException()
                    .setErrorCode(SystemCodeEnum.ERROR_006.getCode(), messageResource)
                    .setStatusCode(HttpStatus.BAD_REQUEST);
        }
        Category category = categoryMapper.toEntity(dto);
        Category savedCategory = categoryRepository.save(category);
        return categoryMapper.entityToResponse(savedCategory);
    }

    @Override
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    public CategoryResponseDTO update(Long id, CategoryRequestDTO dto) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new CommonException()
                    .setErrorCode(SystemCodeEnum.ERROR_005.getCode(), messageResource)
                    .setStatusCode(HttpStatus.BAD_REQUEST));

        if (categoryRepository.existsByNameAndIdNot(dto.getName(), id)) {
            throw new CommonException()
                    .setErrorCode(SystemCodeEnum.ERROR_007.getCode(), messageResource)
                    .setStatusCode(HttpStatus.BAD_REQUEST);
        }

        Category updatedCategory = categoryMapper.toEntity(dto);
        updatedCategory.setId(existingCategory.getId());

        Category updated = categoryRepository.save(updatedCategory);

        return categoryMapper.entityToResponse(updated);
    }

    @Override
    @Transactional(rollbackFor = {Exception.class, Throwable.class})
    public Integer delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new CommonException()
                    .setErrorCode(SystemCodeEnum.ERROR_005.getCode(), messageResource)
                    .setStatusCode(HttpStatus.BAD_REQUEST);
        }

        List<Product> products = productRepository.findAllByCategoryId(id);
        if (!products.isEmpty()) {
            products.forEach(product -> product.setCategoryId(null));
            productRepository.saveAll(products);
        }

        categoryRepository.deleteById(id);
        return 1;
    }
}