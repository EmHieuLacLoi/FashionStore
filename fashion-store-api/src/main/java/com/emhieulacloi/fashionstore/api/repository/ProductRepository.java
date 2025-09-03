package com.emhieulacloi.fashionstore.api.repository;

import com.emhieulacloi.fashionstore.api.base.repository.BaseRepository;
import com.emhieulacloi.fashionstore.api.domains.criteria.ProductCriteria;
import com.emhieulacloi.fashionstore.api.domains.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends BaseRepository<Product, Long, ProductCriteria> {

//    @Query("""
//        SELECT p.id as id, p.name as name, p.description as description,
//               p.price as price, p.stockQuantity as stockQuantity, p.categoryId as categoryId,
//               c.name as categoryName, p.imageUrl as imageUrl,
//               p.createdBy as createdById, p.createdByName as createdByName, p.createdAt as createdAt,
//               p.updatedBy as updatedById, p.updatedByName as updatedByName, p.updatedAt as updatedAt
//        FROM Product p
//        LEFT JOIN Category c ON p.categoryId = c.id
//        WHERE p.id = :id
//    """)
//    <T> T findProjectedById(@Param("id") Long id, Class<T> type);
//
//    @Query("""
//        SELECT p.id as id, p.name as name, p.description as description,
//               p.price as price, p.stockQuantity as stockQuantity, p.categoryId as categoryId,
//               c.name as categoryName, p.imageUrl as imageUrl,
//               p.createdBy as createdById, p.createdByName as createdByName, p.createdAt as createdAt,
//               p.updatedBy as updatedById, p.updatedByName as updatedByName, p.updatedAt as updatedAt
//        FROM Product p
//        LEFT JOIN Category c ON p.categoryId = c.id
//    """)
//    <T> Page<T> findAllProjectedBy(Pageable pageable, Class<T> type);
//
//    @Query("""
//        SELECT p FROM Product p
//        WHERE p.categoryId = :categoryId
//    """)
//    List<Product> findByCategoryId(@Param("categoryId") Long categoryId);
//
//    boolean existsByName(String name);
}
