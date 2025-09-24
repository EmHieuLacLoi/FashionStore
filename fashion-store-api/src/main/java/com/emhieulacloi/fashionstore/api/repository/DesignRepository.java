package com.emhieulacloi.fashionstore.api.repository;

import com.emhieulacloi.fashionstore.api.base.repository.BaseRepository;
import com.emhieulacloi.fashionstore.api.domains.criteria.DesignCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.DesignDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Design;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DesignRepository extends BaseRepository<Design, Long, DesignCriteria, DesignDTO> {
    @Query(value = "SELECT * FROM designs g",
            nativeQuery = true)
    Page<Design> findByCriteria(@Param("criteria") DesignCriteria criteria, Pageable pageable);

    @Query(value = """
    SELECT 
            t.*,
            uc.id AS createdById,
            uc.username AS createdByName,
            uu.id AS updatedById,
            uu.username AS updatedByName
    FROM `designs` t 
    LEFT JOIN user uc ON t.created_by = uc.id
    LEFT JOIN user uu ON t.updated_by = uu.id
    """,
            countQuery = """
    SELECT
            COUNT(*)
    FROM `designs` t
    """,
            nativeQuery = true)
    Page<DesignDTO> findAllByCriteria(@Param("criteria") DesignCriteria criteria, Pageable pageable);

    @Query(value = """
    SELECT 
            g.*,
            uc.id AS createdById,
            uc.username AS createdByName,
            uu.id AS updatedById,
            uu.username AS updatedByName
    FROM `designs` g 
    LEFT JOIN user uc ON g.created_by = uc.id
    LEFT JOIN user uu ON g.updated_by = uu.id
    WHERE g.id = :id
    """, nativeQuery = true)
    Optional<DesignDTO> findByQueryId(@Param("id") Long id);
}
