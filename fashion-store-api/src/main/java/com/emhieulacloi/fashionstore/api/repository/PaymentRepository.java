package com.emhieulacloi.fashionstore.api.repository;

import com.emhieulacloi.fashionstore.api.base.repository.BaseRepository;
import com.emhieulacloi.fashionstore.api.domains.criteria.PaymentCriteria;
import com.emhieulacloi.fashionstore.api.domains.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends BaseRepository<Payment, Long, PaymentCriteria> {

//    @Query("""
//        SELECT p.id as id, p.orderId as orderId, p.paymentMethod as paymentMethod,
//               p.amount as amount, p.paymentDate as paymentDate, p.status as status,
//               p.createdBy as createdById, p.createdByName as createdByName, p.createdAt as createdAt,
//               p.updatedBy as updatedById, p.updatedByName as updatedByName, p.updatedAt as updatedAt
//        FROM Payment p
//        WHERE p.id = :id
//    """)
//    <T> T findProjectedById(@Param("id") Long id, Class<T> type);
//
//    @Query("""
//        SELECT p.id as id, p.orderId as orderId, p.paymentMethod as paymentMethod,
//               p.amount as amount, p.paymentDate as paymentDate, p.status as status,
//               p.createdBy as createdById, p.createdByName as createdByName, p.createdAt as createdAt,
//               p.updatedBy as updatedById, p.updatedByName as updatedByName, p.updatedAt as updatedAt
//        FROM Payment p
//    """)
//    <T> Page<T> findAllProjectedBy(Pageable pageable, Class<T> type);
//
//    @Query("""
//        SELECT p FROM Payment p
//        WHERE p.orderId = :orderId
//    """)
//    List<Payment> findByOrderId(@Param("orderId") Long orderId);
//
//    @Query("""
//        SELECT p FROM Payment p
//        WHERE p.status = :status
//    """)
//    List<Payment> findByStatus(@Param("status") Integer status);
//
//    boolean existsByOrderId(Long orderId);
}
