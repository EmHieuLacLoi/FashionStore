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

import java.util.Optional;

@Repository
public interface PaymentRepository extends BaseRepository<Payment, Long, PaymentCriteria, PaymentDTO> {
    @Query("SELECT p FROM Payment p ")
    Page<Payment> findByCriteria(@Param("criteria") PaymentCriteria criteria, Pageable pageable);
    
    @Query(value = """
    SELECT 
            p.*,
            uc.id AS createdById,
            uc.username AS createdByName,
            uu.id AS updatedById,
            uu.username AS updatedByName
    FROM `payments` p 
    LEFT JOIN user uc ON p.created_by = uc.id
    LEFT JOIN user uu ON p.updated_by = uu.id
    """,
            countQuery = """
    SELECT
            COUNT(*)
    FROM `payments` p
    """,
            nativeQuery = true)
    Page<PaymentDTO> findAllByCriteria(@Param("criteria") PaymentCriteria criteria, Pageable pageable);
    
    @Query(value = """
    SELECT 
            p.*,
            uc.id AS createdById,
            uc.username AS createdByName,
            uu.id AS updatedById,
            uu.username AS updatedByName
    FROM `payments` p 
    LEFT JOIN user uc ON p.created_by = uc.id
    LEFT JOIN user uu ON p.updated_by = uu.id
    WHERE p.id = :id
    """, nativeQuery = true)
    Optional<PaymentDTO> findByQueryId(@Param("id") Long id);
}
