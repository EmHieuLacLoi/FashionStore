package com.emhieulacloi.fashionstore.api.repository;

import com.emhieulacloi.fashionstore.api.domains.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    void deleteByProductId(Long productId);

    List<ProductVariant> findAllByProductId(Long productId);

    boolean existsProductVariantsByProductIdAndColorAndSize(Long productId, String color, String size);
}
