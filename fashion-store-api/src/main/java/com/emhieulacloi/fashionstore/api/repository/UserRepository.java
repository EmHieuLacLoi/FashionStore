package com.emhieulacloi.fashionstore.api.repository;

import com.emhieulacloi.fashionstore.api.base.repository.BaseRepository;
import com.emhieulacloi.fashionstore.api.domains.criteria.UserCriteria;
import com.emhieulacloi.fashionstore.api.domains.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends BaseRepository<User, Long, UserCriteria> {
    @Query("SELECT g FROM User g ")
    Page<User> findByCriteria(@Param("criteria") UserCriteria criteria, Pageable pageable);

    Optional<User> findOneByPhoneNumber(String number);

    Optional<User> findOneByEmailEqualsIgnoreCase(String email);

    Optional<User> findOneByUsername(String username);

    boolean existsByUsername(String username);

    @Query(value = """
            SELECT DISTINCT user.* 
            FROM user 
            LEFT JOIN user_role ON user.id = user_role.user_id
            WHERE (:username IS NULL OR LOWER(username) LIKE LOWER(CONCAT('%', :username, '%')))
              AND (:email IS NULL OR LOWER(email) LIKE LOWER(CONCAT('%', :email, '%')))
              AND (:full_name IS NULL OR LOWER(full_name) LIKE LOWER(CONCAT('%', :full_name, '%')))
              AND (:phone_number IS NULL OR phone_number LIKE CONCAT('%', :phone_number, '%'))
              AND (:gender IS NULL OR gender = :gender)
              AND (:is_active IS NULL OR is_active = :is_active)
              AND (:rolesStr IS NULL OR FIND_IN_SET(user.role_id, :rolesStr))
              AND (:groupStr IS NULL OR FIND_IN_SET(user.group_id, :groupStr))
            """,
            countQuery = """
                    SELECT COUNT(DISTINCT user.id)
                    FROM user 
                    LEFT JOIN user_role ON user.id = user_role.user_id
                    WHERE (:username IS NULL OR LOWER(username) LIKE LOWER(CONCAT('%', :username, '%')))
                      AND (:email IS NULL OR LOWER(email) LIKE LOWER(CONCAT('%', :email, '%')))
                      AND (:full_name IS NULL OR LOWER(full_name) LIKE LOWER(CONCAT('%', :full_name, '%')))
                      AND (:phone_number IS NULL OR phone_number LIKE CONCAT('%', :phone_number, '%'))
                      AND (:gender IS NULL OR gender = :gender)
                      AND (:is_active IS NULL OR is_active = :is_active)
                      AND (:rolesStr IS NULL OR FIND_IN_SET(user.role_id, :rolesStr))
                      AND (:groupStr IS NULL OR FIND_IN_SET(user.group_id, :groupStr))
                    """,
            nativeQuery = true)
    Page<User> findUsersByFilters(
            @Param("username") String username,
            @Param("email") String email,
            @Param("full_name") String fullName,
            @Param("phone_number") String phoneNumber,
            Pageable pageable);
}
