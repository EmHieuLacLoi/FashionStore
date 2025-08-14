package com.emhieulacloi.fashionstore.api.base.service;

import com.emhieulacloi.fashionstore.api.common.exception.CommonException;
import org.springframework.stereotype.Service;

@Service
public class BaseCrudService<R, D, ID> implements CustomCrudService<R, D, ID> {

    @Override
    public R save(D dto) throws CommonException {
        return null;
    }

    @Override
    public R update(ID id, D dto) throws CommonException {
        return null;
    }

    @Override
    public Integer delete(ID id) {
        return 0;
    }
}
