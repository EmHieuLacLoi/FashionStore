package com.emhieulacloi.fashionstore.api.service.impl;

import com.emhieulacloi.fashionstore.api.domains.dto.request.UserRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.UserResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.User;
import com.emhieulacloi.fashionstore.api.repository.UserRepository;
import com.emhieulacloi.fashionstore.api.service.UserService;
import com.emhieulacloi.fashionstore.api.service.mapper.UserMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@Primary
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository,
                           UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    public UserResponseDTO save(UserRequestDTO dto) {
        // Map DTO to entity
        User user = userMapper.toEntity(dto);

        // Save the user
        User savedUser = userRepository.save(user);

        // Map saved entity to response DTO
        return userMapper.entityToResponse(savedUser);
    }

    @Override
    public UserResponseDTO update(Long id, UserRequestDTO dto) {
        // Find existing user or throw exception if not found
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));

        // Map DTO to existing entity
        User updatedUser = userMapper.toEntity(dto);
        updatedUser.setId(existingUser.getId()); // Preserve the ID

        // Save the updated user
        User savedUser = userRepository.save(updatedUser);

        // Map saved entity to response DTO
        return userMapper.entityToResponse(savedUser);
    }

    @Override
    public Integer delete(Long id) {
        // Check if user exists
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found with id: " + id);
        }

        // Delete the user
        userRepository.deleteById(id);
        return 1;
    }
}
