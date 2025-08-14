package com.emhieulacloi.fashionstore.api.service.query;

import com.emhieulacloi.fashionstore.api.base.service.BaseQueryService;
import com.emhieulacloi.fashionstore.api.domains.criteria.UserCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.response.UserResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.User;
import com.emhieulacloi.fashionstore.api.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class UserQueryService extends BaseQueryService<UserResponseDTO, UserCriteria, Long, User> {

    public UserQueryService(UserRepository repository, ModelMapper modelMapper) {
        super(repository, modelMapper, UserResponseDTO.class);
    }
}
