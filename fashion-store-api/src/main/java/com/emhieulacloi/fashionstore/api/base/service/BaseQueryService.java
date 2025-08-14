package com.emhieulacloi.fashionstore.api.base.service;

import com.emhieulacloi.fashionstore.api.base.repository.QueryRepository;
import com.emhieulacloi.fashionstore.api.common.exception.CommonException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;

import java.util.List;

public class BaseQueryService<IResponse, ICriteria, ID, TEntity> implements CustomQueryService<IResponse, ICriteria, ID> {

    private final QueryRepository<TEntity, ID, ICriteria> repository;
    private final ModelMapper modelMapper;
    private final Class<IResponse> responseClass;

    public BaseQueryService(QueryRepository<TEntity, ID, ICriteria> repository,
                            ModelMapper modelMapper,
                            Class<IResponse> responseClass) {
        this.repository = repository;
        this.modelMapper = modelMapper;
        this.responseClass = responseClass;
    }

    @Override
    public Page<IResponse> findAllByCriteria(ICriteria criteria, Pageable pageable) {
        Page<TEntity> data = repository.findByCriteria(criteria, pageable);

        List<IResponse> result = data.stream()
                .map(this::mapEntityToResponse)
                .toList();

        return new PageImpl<>(result, pageable, data.getTotalElements());
    }

    @Override
    public IResponse getById(ID id) throws CommonException {
        TEntity entity = repository.findById(id)
                .orElseThrow(() -> new CommonException()
                        .setStatusCode(HttpStatus.BAD_REQUEST)
                        .setMessage("Không tìm thấy id: " + id.toString()));

        return mapEntityToResponse(entity);
    }

    private IResponse mapEntityToResponse(TEntity entity) {
        return modelMapper.map(entity, responseClass);
    }
}
