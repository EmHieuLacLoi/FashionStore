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
}
