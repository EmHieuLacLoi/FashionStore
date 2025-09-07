package com.emhieulacloi.fashionstore.api.repository;

import com.emhieulacloi.fashionstore.api.base.repository.BaseRepository;
import com.emhieulacloi.fashionstore.api.domains.criteria.OrderItemCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.OrderItemDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.OrderItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderItemRepository extends BaseRepository<OrderItem, Long, OrderItemCriteria> {
    @Query("SELECT oi FROM OrderItem oi ")
    Page<OrderItem> findByCriteria(@Param("criteria") OrderItemCriteria criteria, Pageable pageable);
    
    @Query(value = """
    SELECT 
            t.*,
            uc.id AS createdById,
            uc.username AS createdByName,
            uu.id AS updatedById,
            uu.username AS updatedByName
    FROM `order_items` t 
    LEFT JOIN user uc ON t.created_by = uc.id
    LEFT JOIN user uu ON t.updated_by = uu.id
    """,
            countQuery = """
    SELECT
            COUNT(*)
    FROM `order_items` t
    """,
            nativeQuery = true)
    Page<OrderItemDTO> findAllByCriteria(@Param("criteria") OrderItemCriteria criteria, Pageable pageable);
    
    @Query(value = """
    SELECT 
            oi.*,
            uc.id AS createdById,
            uc.username AS createdByName,
            uu.id AS updatedById,
            uu.username AS updatedByName
    FROM `order_items` oi 
    LEFT JOIN user uc ON oi.created_by = uc.id
    LEFT JOIN user uu ON oi.updated_by = uu.id
    WHERE oi.id = :id
    """, nativeQuery = true)
    Optional<OrderItemDTO> findByQueryId(@Param("id") Long id);

    boolean existsByProductVariantId(Long productVariantId);

    void deleteAllByOrderId(Long orderId);

    List<OrderItem> findAllByOrderId(Long orderId);
}
