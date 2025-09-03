package com.emhieulacloi.fashionstore.api.repository;

import com.emhieulacloi.fashionstore.api.base.repository.BaseRepository;
import com.emhieulacloi.fashionstore.api.domains.criteria.CategoryCriteria;
import com.emhieulacloi.fashionstore.api.domains.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends BaseRepository<Category, Long, CategoryCriteria> {
    
//    @Query("""
//        SELECT c.id as id, c.name as name, c.description as description,
//               c.createdBy as createdById, c.createdByName as createdByName, c.createdAt as createdAt,
//               c.updatedBy as updatedById, c.updatedByName as updatedByName, c.updatedAt as updatedAt
//        FROM Category c
//        WHERE c.id = :id
//    """)
//    <T> T findProjectedById(@Param("id") Long id, Class<T> type);
//
//    @Query("""
//        SELECT c.id as id, c.name as name, c.description as description,
//               c.createdBy as createdById, c.createdByName as createdByName, c.createdAt as createdAt,
//               c.updatedBy as updatedById, c.updatedByName as updatedByName, c.updatedAt as updatedAt
//        FROM Category c
//    """)
//    <T> Page<T> findAllProjectedBy(Pageable pageable, Class<T> type);
//
//    boolean existsByName(String name);
}
