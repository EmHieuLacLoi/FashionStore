package com.emhieulacloi.fashionstore.api.base.mapper;

public interface BaseMapper<D, E, Q, R>{
    E toEntity(Q request);
    R entityToResponse(E entity);
    R dtoToResponse(D dto);
    E cloneEntity(E entity);
}
