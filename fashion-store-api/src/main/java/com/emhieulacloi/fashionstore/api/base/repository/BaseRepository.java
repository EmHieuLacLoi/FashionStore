package com.emhieulacloi.fashionstore.api.base.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface BaseRepository<TEntity, ID, ICriteria> extends JpaRepository<TEntity, ID>, QueryRepository<TEntity, ID, ICriteria> {

}
