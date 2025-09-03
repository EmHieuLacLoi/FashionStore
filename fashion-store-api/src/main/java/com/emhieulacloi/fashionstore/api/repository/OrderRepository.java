package com.emhieulacloi.fashionstore.api.repository;

import com.emhieulacloi.fashionstore.api.base.repository.BaseRepository;
import com.emhieulacloi.fashionstore.api.domains.criteria.OrderCriteria;
import com.emhieulacloi.fashionstore.api.domains.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends BaseRepository<Order, Long, OrderCriteria> {

//    @Query("""
//        SELECT o.id as id, o.userId as userId,
//               CONCAT(u.firstName, ' ', u.lastName) as userName,
//               o.status as status, o.totalAmount as totalAmount,
//               o.createdBy as createdById, o.createdByName as createdByName, o.createdAt as createdAt,
//               o.updatedBy as updatedById, o.updatedByName as updatedByName, o.updatedAt as updatedAt
//        FROM Order o
//        LEFT JOIN User u ON o.userId = u.id
//        WHERE o.id = :id
//    """)
//    <T> T findProjectedById(@Param("id") Long id, Class<T> type);
//
//    @Query("""
//        SELECT o.id as id, o.userId as userId,
//               CONCAT(u.firstName, ' ', u.lastName) as userName,
//               o.status as status, o.totalAmount as totalAmount,
//               o.createdBy as createdById, o.createdByName as createdByName, o.createdAt as createdAt,
//               o.updatedBy as updatedById, o.updatedByName as updatedByName, o.updatedAt as updatedAt
//        FROM Order o
//        LEFT JOIN User u ON o.userId = u.id
//    """)
//    <T> Page<T> findAllProjectedBy(Pageable pageable, Class<T> type);
//
//    @Query("""
//        SELECT o FROM Order o
//        WHERE o.userId = :userId
//        ORDER BY o.createdAt DESC
//    """)
//    List<Order> findByUserId(@Param("userId") Long userId);
//
//    @Query("""
//        SELECT o FROM Order o
//        WHERE o.status = :status
//    """)
//    List<Order> findByStatus(@Param("status") Integer status);
}
