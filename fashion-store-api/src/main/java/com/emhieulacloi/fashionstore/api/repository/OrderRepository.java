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

import java.util.Optional;

@Repository
public interface OrderRepository extends BaseRepository<Order, Long, OrderCriteria, OrderDTO> {
    @Query("SELECT o FROM Order o ")
    Page<Order> findByCriteria(@Param("criteria") OrderCriteria criteria, Pageable pageable);
    
    @Query(value = """
    SELECT 
            o.*,
            uc.id AS createdById,
            uc.username AS createdByName,
            uu.id AS updatedById,
            uu.username AS updatedByName
    FROM `orders` o 
    LEFT JOIN user uc ON o.created_by = uc.id
    LEFT JOIN user uu ON o.updated_by = uu.id
    """,
            countQuery = """
    SELECT
            COUNT(*)
    FROM `orders` o
    """,
            nativeQuery = true)
    Page<OrderDTO> findAllByCriteria(@Param("criteria") OrderCriteria criteria, Pageable pageable);
    
    @Query(value = """
    SELECT 
            o.*,
            uc.id AS createdById,
            uc.username AS createdByName,
            uu.id AS updatedById,
            uu.username AS updatedByName
    FROM `orders` o 
    LEFT JOIN user uc ON o.created_by = uc.id
    LEFT JOIN user uu ON o.updated_by = uu.id
    WHERE o.id = :id
    """, nativeQuery = true)
    Optional<OrderDTO> findByQueryId(@Param("id") Long id);
}
