package com.emhieulacloi.fashionstore.api.repository;

import com.emhieulacloi.fashionstore.api.base.repository.BaseRepository;
import com.emhieulacloi.fashionstore.api.domains.criteria.OrderCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.OrderDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OrderRepository extends BaseRepository<Order, Long, OrderCriteria, OrderDTO> {
    @Query("SELECT o FROM Order o ")
    Page<Order> findByCriteria(@Param("criteria") OrderCriteria criteria, Pageable pageable);
    
    @Query(value = """
    SELECT 
            o.*,
            u.full_name AS userName,
            uc.id AS createdById,
            uc.username AS createdByName,
            uu.id AS updatedById,
            uu.username AS updatedByName
    FROM `orders` o 
    LEFT JOIN user u ON o.user_id = u.id
    LEFT JOIN user uc ON o.created_by = uc.id
    LEFT JOIN user uu ON o.updated_by = uu.id
    WHERE
           (:#{#criteria.code} IS NULL OR o.code LIKE :#{#criteria.code}) AND
           (:#{#criteria.fullName} IS NULL OR u.full_name LIKE :#{#criteria.fullName}) AND
           (:#{#criteria.minPrice} IS NULL OR o.total_amount >= :#{#criteria.minPrice}) AND
           (:#{#criteria.maxPrice} IS NULL OR o.total_amount <= :#{#criteria.maxPrice}) AND
           (:#{#criteria.status} IS NULL OR o.status = :#{#criteria.status})
    """,
            countQuery = """
    SELECT
            COUNT(*)
    FROM `orders` o
    LEFT JOIN user u ON o.user_id = u.id
    WHERE
           (:#{#criteria.code} IS NULL OR o.code LIKE :#{#criteria.code}) AND
           (:#{#criteria.fullName} IS NULL OR u.full_name LIKE :#{#criteria.fullName}) AND
           (:#{#criteria.minPrice} IS NULL OR o.total_amount >= :#{#criteria.minPrice}) AND
           (:#{#criteria.maxPrice} IS NULL OR o.total_amount <= :#{#criteria.maxPrice}) AND
           (:#{#criteria.status} IS NULL OR o.status = :#{#criteria.status})
    """,
            nativeQuery = true)
    Page<OrderDTO> findAllByCriteria(@Param("criteria") OrderCriteria criteria, Pageable pageable);
    
    @Query(value = """
    SELECT 
            o.*,
            u.full_name AS userName,
            uc.id AS createdById,
            uc.username AS createdByName,
            uu.id AS updatedById,
            uu.username AS updatedByName
    FROM `orders` o 
    LEFT JOIN user u ON o.user_id = u.id
    LEFT JOIN user uc ON o.created_by = uc.id
    LEFT JOIN user uu ON o.updated_by = uu.id
    WHERE o.id = :id
    """, nativeQuery = true)
    Optional<OrderDTO> findByQueryId(@Param("id") Long id);

    @Query("SELECT COUNT(o.id) FROM Order o WHERE o.createdAt >= :startDate AND o.createdAt < :endDate")
    Long countOrdersBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
