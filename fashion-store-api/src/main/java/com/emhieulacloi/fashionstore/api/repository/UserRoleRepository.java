package com.emhieulacloi.fashionstore.api.repository;

import com.emhieulacloi.fashionstore.api.domains.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    UserRole findByUserId(Long userId);
}
