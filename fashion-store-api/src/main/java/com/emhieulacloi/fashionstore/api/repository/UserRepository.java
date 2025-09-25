package com.emhieulacloi.fashionstore.api.repository;

import com.emhieulacloi.fashionstore.api.base.repository.BaseRepository;
import com.emhieulacloi.fashionstore.api.domains.criteria.UserCriteria;
import com.emhieulacloi.fashionstore.api.domains.dto.projection.UserDTO;
import com.emhieulacloi.fashionstore.api.domains.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends BaseRepository<User, Long, UserCriteria, UserDTO> {
    @Query("SELECT g FROM User g ")
    Page<User> findByCriteria(@Param("criteria") UserCriteria criteria, Pageable pageable);

    @Query(value = """
    SELECT 
            p.*
    FROM `users` p 
    """,
            countQuery = """
    SELECT
            COUNT(*)
    FROM `users` p
    """,
            nativeQuery = true)
    Page<UserDTO> findAllByCriteria(@Param("criteria") UserCriteria criteria, Pageable pageable);

    @Query(value = """
    SELECT t.* FROM users t WHERE t.id = :id
    """, nativeQuery = true)
    Optional<UserDTO> findByQueryId(Long id);

    Optional<User> findOneByPhoneNumber(String number);

    Optional<User> findOneByEmailEqualsIgnoreCase(String email);

    Optional<User> findOneByUsername(String username);

    boolean existsByUsername(String username);

    @Query(value = """
            SELECT DISTINCT u.* 
            FROM user u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            WHERE (:username IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :username, '%')))
              AND (:email IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%')))
              AND (:full_name IS NULL OR LOWER(u.full_name) LIKE LOWER(CONCAT('%', :full_name, '%')))
              AND (:phone_number IS NULL OR u.phone_number LIKE CONCAT('%', :phone_number, '%'))
            """,
            countQuery = """
            SELECT COUNT(DISTINCT u.id)
            FROM user u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            WHERE (:username IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :username, '%')))
              AND (:email IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%')))
              AND (:full_name IS NULL OR LOWER(u.full_name) LIKE LOWER(CONCAT('%', :full_name, '%')))
              AND (:phone_number IS NULL OR u.phone_number LIKE CONCAT('%', :phone_number, '%'))
            """,
            nativeQuery = true)
    Page<User> findUsersByFilters(
            @Param("username") String username,
            @Param("email") String email,
            @Param("full_name") String fullName,
            @Param("phone_number") String phoneNumber,
            Pageable pageable);
}
