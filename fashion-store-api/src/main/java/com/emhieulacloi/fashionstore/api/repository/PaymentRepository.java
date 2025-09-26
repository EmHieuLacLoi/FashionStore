package com.emhieulacloi.fashionstore.api.repository;

import com.emhieulacloi.fashionstore.api.base.repository.BaseRepository;
import com.emhieulacloi.fashionstore.api.domains.criteria.PaymentCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.PaymentDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends BaseRepository<Payment, Long, PaymentCriteria, PaymentDTO> {
    @Query("SELECT p FROM Payment p ")
    Page<Payment> findByCriteria(@Param("criteria") PaymentCriteria criteria, Pageable pageable);
    
    @Query(value = """
    SELECT 
            p.*,
            o.code as orderCode,
            o.status as orderStatus,
            uc.id AS createdById,
            uc.username AS createdByName,
            uu.id AS updatedById,
            uu.username AS updatedByName
    FROM `payments` p 
    LEFT JOIN user uc ON p.created_by = uc.id
    LEFT JOIN user uu ON p.updated_by = uu.id
    LEFT JOIN orders o ON p.order_id = o.id
    WHERE 
           (:#{#criteria.orderCode} IS NULL OR o.code LIKE :#{#criteria.orderCode}) AND
           (:#{#criteria.minAmount} IS NULL OR p.amount >= :#{#criteria.minAmount}) AND
           (:#{#criteria.maxAmount} IS NULL OR p.amount <= :#{#criteria.maxAmount}) AND
           (:#{#criteria.status} IS NULL OR p.status = :#{#criteria.status}) AND
           (:#{#criteria.paymentMethod} IS NULL OR p.payment_method = :#{#criteria.paymentMethod})
    """,
            countQuery = """
    SELECT
            COUNT(*)
    FROM `payments` p
    LEFT JOIN user uc ON p.created_by = uc.id
    LEFT JOIN user uu ON p.updated_by = uu.id
    LEFT JOIN orders o ON p.order_id = o.id
    WHERE 
           (:#{#criteria.orderCode} IS NULL OR o.code LIKE :#{#criteria.orderCode}) AND
           (:#{#criteria.minAmount} IS NULL OR p.amount >= :#{#criteria.minAmount}) AND
           (:#{#criteria.maxAmount} IS NULL OR p.amount <= :#{#criteria.maxAmount}) AND
           (:#{#criteria.status} IS NULL OR p.status = :#{#criteria.status}) AND
           (:#{#criteria.paymentMethod} IS NULL OR p.payment_method = :#{#criteria.paymentMethod})
    """,
            nativeQuery = true)
    Page<PaymentDTO> findAllByCriteria(@Param("criteria") PaymentCriteria criteria, Pageable pageable);
    
    @Query(value = """
    SELECT 
            p.*,
            o.code as orderCode,
            o.status as orderStatus,
            uc.id AS createdById,
            uc.username AS createdByName,
            uu.id AS updatedById,
            uu.username AS updatedByName
    FROM `payments` p 
    LEFT JOIN user uc ON p.created_by = uc.id
    LEFT JOIN user uu ON p.updated_by = uu.id
    LEFT JOIN orders o ON p.order_id = o.id
    WHERE p.id = :id
    """, nativeQuery = true)
    Optional<PaymentDTO> findByQueryId(@Param("id") Long id);

    List<Payment> findAllByOrderIdIn(List<Long> orderIds);

    @Query("SELECT COALESCE(SUM(p.amount), 0.0) FROM Payment p WHERE p.paymentDate >= :startDate AND p.paymentDate < :endDate")
    Double findRevenueBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query(value = "SELECT CAST(p.payment_date AS DATE) as date, SUM(p.amount) as totalAmount " +
            "FROM payments p " +
            "WHERE p.payment_date >= :startDate " +
            "GROUP BY CAST(p.payment_date AS DATE) " +
            "ORDER BY date ASC",
            nativeQuery = true)
    List<Object[]> findRevenueLast7DaysRaw(@Param("startDate") LocalDateTime startDate);
}
