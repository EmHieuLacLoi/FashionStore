package com.emhieulacloi.fashionstore.api.service.impl;

import com.emhieulacloi.fashionstore.api.domains.dto.request.UserRequestDTO;
import com.emhieulacloi.fashionstore.api.domains.dto.response.UserResponseDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.User;
import com.emhieulacloi.fashionstore.api.repository.UserRepository;
import com.emhieulacloi.fashionstore.api.service.UserService;
import com.emhieulacloi.fashionstore.api.service.mapper.UserMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository,
                           UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    @Transactional
    public UserResponseDTO createUser(UserRequestDTO userRequestDTO) {
        // Map DTO to entity
        User user = userMapper.toEntity(userRequestDTO);
        
        // Save the user
        User savedUser = userRepository.save(user);
        
        // Map saved entity to response DTO
        return userMapper.entityToResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long id) {
        // Find user by ID or throw exception if not found
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        
        // Map entity to response DTO
        return userMapper.entityToResponse(user);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        // Find all users
        List<User> users = userRepository.findAll();
        
        // Map entities to response DTOs
        return users.stream()
                .map(userMapper::entityToResponse)
                .toList();
    }

    @Override
    @Transactional
    public UserResponseDTO updateUser(Long id, UserRequestDTO userRequestDTO) {
        // Find existing user or throw exception if not found
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        
        // Map DTO to existing entity
        User updatedUser = userMapper.toEntity(userRequestDTO);
        updatedUser.setId(existingUser.getId()); // Preserve the ID
        
        // Save the updated user
        User savedUser = userRepository.save(updatedUser);
        
        // Map saved entity to response DTO
        return userMapper.entityToResponse(savedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        // Check if user exists
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found with id: " + id);
        }
        
        // Delete the user
        userRepository.deleteById(id);
    }
}
