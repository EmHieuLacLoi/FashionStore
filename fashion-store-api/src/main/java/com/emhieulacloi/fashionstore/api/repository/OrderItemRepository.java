package com.emhieulacloi.fashionstore.api.repository;

import com.emhieulacloi.fashionstore.api.base.repository.BaseRepository;
import com.emhieulacloi.fashionstore.api.domains.criteria.OrderItemCriteria;
import com.emhieulacloi.fashionstore.api.domains.entity.OrderItem;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends BaseRepository<OrderItem, Long, OrderItemCriteria> {

//    @Query("""
//        SELECT oi.id as id, oi.orderId as orderId, oi.productId as productId,
//               p.name as productName, oi.quantity as quantity,
//               oi.unitPrice as unitPrice, oi.totalPrice as totalPrice,
//               oi.createdBy as createdById, oi.createdByName as createdByName, oi.createdAt as createdAt,
//               oi.updatedBy as updatedById, oi.updatedByName as updatedByName, oi.updatedAt as updatedAt
//        FROM OrderItem oi
//        JOIN Product p ON oi.productId = p.id
//        WHERE oi.id = :id
//    """)
//    <T> T findProjectedById(@Param("id") Long id, Class<T> type);
//
//    @Query("""
//        SELECT oi.id as id, oi.orderId as orderId, oi.productId as productId,
//               p.name as productName, oi.quantity as quantity,
//               oi.unitPrice as unitPrice, oi.totalPrice as totalPrice,
//               oi.createdBy as createdById, oi.createdByName as createdByName, oi.createdAt as createdAt,
//               oi.updatedBy as updatedById, oi.updatedByName as updatedByName, oi.updatedAt as updatedAt
//        FROM OrderItem oi
//        JOIN Product p ON oi.productId = p.id
//    """)
//    <T> Page<T> findAllProjectedBy(Pageable pageable, Class<T> type);
//
//    @Query("""
//        SELECT oi FROM OrderItem oi
//        WHERE oi.orderId = :orderId
//    """)
//    List<OrderItem> findByOrderId(@Param("orderId") Long orderId);
//
//    @Query("""
//        SELECT oi FROM OrderItem oi
//        WHERE oi.productId = :productId
//    """)
//    List<OrderItem> findByProductId(@Param("productId") Long productId);
}
