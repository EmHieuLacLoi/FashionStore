package com.emhieulacloi.fashionstore.api.base.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomQueryService<IResponse, ICriteria, ID> {

    Page<IResponse> findAllByCriteria(ICriteria criteria, Pageable pageable);

    IResponse getById(ID id);
}

