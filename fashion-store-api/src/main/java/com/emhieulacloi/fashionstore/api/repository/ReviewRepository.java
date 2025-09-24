package com.emhieulacloi.fashionstore.api.repository;

import com.emhieulacloi.fashionstore.api.base.repository.BaseRepository;
import com.emhieulacloi.fashionstore.api.domains.criteria.DesignCriteria;
import com.emhieulacloi.fashionstore.api.domains.criteria.ReviewCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.DesignDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.ReviewDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Design;
import com.emhieulacloi.fashionstore.api.domains.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends BaseRepository<Review, Long, ReviewCriteria, ReviewDTO> {
    @Query(value = "SELECT * FROM reviews g",
            nativeQuery = true)
    Page<Review> findByCriteria(@Param("criteria") ReviewCriteria criteria, Pageable pageable);

    @Query(value = """
    SELECT 
            g.*,
            p.name AS productName,
            u.full_name AS customerName,
            uc.id AS createdById,
            uc.username AS createdByName,
            uu.id AS updatedById,
            uu.username AS updatedByName
    FROM `reviews` g 
    LEFT JOIN product p ON g.product_id = p.id
    LEFT JOIN user u ON g.customer_id = u.id
    LEFT JOIN user uc ON g.created_by = uc.id
    LEFT JOIN user uu ON g.updated_by = uu.id
    WHERE 
        (:#{#criteria.productId} IS NULL OR g.product_id = :#{#criteria.productId}) AND 
        (:#{#criteria.customerId} IS NULL OR g.customer_id = :#{#criteria.customerId})
    """,
            countQuery = """
    SELECT
            COUNT(*)
    FROM `reviews` t
     WHERE 
        (:#{#criteria.productId} IS NULL OR g.product_id = :#{#criteria.productId}) AND 
        (:#{#criteria.customerId} IS NULL OR g.customer_id = :#{#criteria.customerId})
    """,
            nativeQuery = true)
    Page<ReviewDTO> findAllByCriteria(@Param("criteria") ReviewCriteria criteria, Pageable pageable);

    @Query(value = """
    SELECT 
            g.*,
            p.name AS productName,
            u.full_name AS customerName,
            uc.id AS createdById,
            uc.username AS createdByName,
            uu.id AS updatedById,
            uu.username AS updatedByName
    FROM `reviews` g 
    LEFT JOIN product p ON g.product_id = p.id
    LEFT JOIN user u ON g.customer_id = u.id
    LEFT JOIN user uc ON g.created_by = uc.id
    LEFT JOIN user uu ON g.updated_by = uu.id
    WHERE g.id = :id
    """, nativeQuery = true)
    Optional<ReviewDTO> findByQueryId(@Param("id") Long id);

    boolean existsByCustomerIdAndProductId(Long customerId, Long productId);
}
