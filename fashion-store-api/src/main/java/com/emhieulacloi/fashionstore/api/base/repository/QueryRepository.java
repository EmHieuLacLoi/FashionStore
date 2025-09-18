package com.emhieulacloi.fashionstore.api.base.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface QueryRepository<TEntity, ID, ICriteria, Query> {

    Page<TEntity> findByCriteria(ICriteria criteria, Pageable pageable);

    Page<Query> findAllByCriteria(ICriteria criteria, Pageable pageable);

    Optional<Query> findByQueryId(ID id);

    Optional<TEntity> findById(ID id);

}