package com.emhieulacloi.fashionstore.api.base.service;

import com.emhieulacloi.fashionstore.api.base.repository.QueryRepository;
import com.emhieulacloi.fashionstore.api.common.exception.CommonException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;

import java.util.List;

public class BaseQueryService<IResponse, ICriteria, ID, TEntity, Query> implements CustomQueryService<IResponse, ICriteria, ID> {

    private final QueryRepository<TEntity, ID, ICriteria, Query> repository;
    private final ModelMapper modelMapper;
    private final Class<IResponse> responseClass;

    public BaseQueryService(QueryRepository<TEntity, ID, ICriteria, Query> repository,
                            ModelMapper modelMapper,
                            Class<IResponse> responseClass) {
        this.repository = repository;
        this.modelMapper = modelMapper;
        this.responseClass = responseClass;
    }

    @Override
    public Page<IResponse> findAllByCriteria(ICriteria criteria, Pageable pageable) {
        Page<Query> data = repository.findAllByCriteria(criteria, pageable);

        List<IResponse> result = data.stream()
                .map(this::mapEntityToResponse)
                .toList();

        return new PageImpl<>(result, pageable, data.getTotalElements());
    }

    @Override
    public IResponse getById(ID id) throws CommonException {
        Query query = repository.findByQueryId(id)
                .orElseThrow(() -> new CommonException().setMessage("Entity not found with id: " + id));

        return mapEntityToResponse(query);
    }

    private IResponse mapEntityToResponse(Query entity) {
        return modelMapper.map(entity, responseClass);
    }
}
