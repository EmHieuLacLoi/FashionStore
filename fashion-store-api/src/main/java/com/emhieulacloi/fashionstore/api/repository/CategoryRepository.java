package com.emhieulacloi.fashionstore.api.repository;

import com.emhieulacloi.fashionstore.api.base.repository.BaseRepository;
import com.emhieulacloi.fashionstore.api.domains.criteria.CategoryCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.CategoryDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends BaseRepository<Category, Long, CategoryCriteria> {
    @Query("SELECT g FROM Category g ")
    Page<Category> findByCriteria(@Param("criteria") CategoryCriteria criteria, Pageable pageable);

    @Query(value = """
    SELECT 
            t.*,
            uc.id AS createdById,
            uc.username AS createdByName,
            uu.id AS updatedById,
            uu.username AS updatedByName
    FROM `categories` t 
    LEFT JOIN user uc ON t.created_by = uc.id
    LEFT JOIN user uu ON t.updated_by = uu.id
    """,
            countQuery = """
    SELECT
            COUNT(*)
    FROM `categories` t
    """,
            nativeQuery = true)
    Page<CategoryDTO> findAllByCriteria(@Param("criteria")  CategoryCriteria criteria, Pageable pageable);

    @Query(value = """
    SELECT 
            g.*,
            uc.id AS createdById,
            uc.username AS createdByName,
            uu.id AS updatedById,
            uu.username AS updatedByName
    FROM `categories` g 
    LEFT JOIN user uc ON g.created_by = uc.id
    LEFT JOIN user uu ON g.updated_by = uu.id
    WHERE g.id = :id
    """, nativeQuery = true)
    Optional<CategoryDTO> findByQueryId(@Param("id") Long id);

}
