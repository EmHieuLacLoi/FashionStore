package com.emhieulacloi.fashionstore.api.base.controller;

import com.emhieulacloi.fashionstore.api.base.service.CustomCrudService;
import com.emhieulacloi.fashionstore.api.base.service.CustomQueryService;
import com.emhieulacloi.fashionstore.api.common.component.ResponseDataConfiguration;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class BaseController<IResponse, ICriteria, R, D, ID> {

    protected CustomQueryService<IResponse, ICriteria, ID> queryService;

    protected CustomCrudService<R, D, ID> crudService;

    @Autowired
    public void setCustomQueryService(CustomQueryService<IResponse, ICriteria, ID> queryService) {
        this.queryService = queryService;
    }

    @Autowired
    public void setCustomCrudService(CustomCrudService<R, D, ID> crudService) {
        this.crudService = crudService;
    }

    @GetMapping
    public ResponseEntity<Page<IResponse>> getAll(@ModelAttribute ICriteria request, Pageable pageable) {
        ResponseEntity<Page<IResponse>> response;
        try {
            response = ResponseDataConfiguration.success(queryService.findAllByCriteria(request, pageable));
        } catch (Exception ex) {
            response = ResponseDataConfiguration.handleResponseException(ex);
        }
        return response;
    }

    @GetMapping("/{id}")
    public ResponseEntity<IResponse> getById(@PathVariable ID id) {
        ResponseEntity<IResponse> response;
        try {
            response = ResponseDataConfiguration.success(queryService.getById(id));
        } catch (Exception ex) {
            response = ResponseDataConfiguration.handleResponseException(ex);
        }
        return response;
    }

    @PostMapping
    public ResponseEntity<R> save(@Valid @RequestBody D dto) {
        ResponseEntity<R> response;
        try {
            response = ResponseDataConfiguration.success(crudService.save(dto));
        } catch (Exception ex) {
            response = ResponseDataConfiguration.handleResponseException(ex);
        }
        return response;
    }

    @PutMapping("/{id}")
    public ResponseEntity<R> update(@PathVariable ID id, @Valid @RequestBody D dto) {
        ResponseEntity<R> response;
        try {
            response = ResponseDataConfiguration.success(crudService.update(id, dto));
        } catch (Exception ex) {
            response = ResponseDataConfiguration.handleResponseException(ex);
        }
        return response;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> delete(@PathVariable ID id) {
        ResponseEntity<Integer> response;
        try {
            response = ResponseDataConfiguration.success(crudService.delete(id));
        } catch (Exception ex) {
            response = ResponseDataConfiguration.handleResponseException(ex);
        }
        return response;
    }
}
