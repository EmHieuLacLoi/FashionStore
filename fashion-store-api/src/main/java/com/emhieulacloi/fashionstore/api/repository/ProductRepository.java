package com.emhieulacloi.fashionstore.api.repository;

import com.emhieulacloi.fashionstore.api.base.repository.BaseRepository;
import com.emhieulacloi.fashionstore.api.domains.criteria.ProductCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.ProductDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends BaseRepository<Product, Long, ProductCriteria> {
    @Query("SELECT p FROM Product p ")
    Page<Product> findByCriteria(@Param("criteria") ProductCriteria criteria, Pageable pageable);
    
    @Query(value = """
    SELECT 
            p.*,
            c.name AS categoryName,
            uc.id AS createdById,
            uc.username AS createdByName,
            uu.id AS updatedById,
            uu.username AS updatedByName
    FROM `products` p 
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN user uc ON p.created_by = uc.id
    LEFT JOIN user uu ON p.updated_by = uu.id
    """,
            countQuery = """
    SELECT
            COUNT(*)
    FROM `products` p
    """,
            nativeQuery = true)
    Page<ProductDTO> findAllByCriteria(@Param("criteria") ProductCriteria criteria, Pageable pageable);
    
    @Query(value = """
    SELECT 
            p.*,
            c.name AS categoryName,
            uc.id AS createdById,
            uc.username AS createdByName,
            uu.id AS updatedById,
            uu.username AS updatedByName
    FROM `products` p 
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN user uc ON p.created_by = uc.id
    LEFT JOIN user uu ON p.updated_by = uu.id
    WHERE p.id = :id
    """, nativeQuery = true)
    Optional<ProductDTO> findByQueryId(@Param("id") Long id);

    List<Product> findAllByCategoryId(Long categoryId);
}
