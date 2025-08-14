package com.emhieulacloi.fashionstore.api.base.service;

public interface CustomCrudService<R, D, ID> {

    R save(D dto);

    R update(ID id,D dto);

    Integer delete(ID id);
}
