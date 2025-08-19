package com.emhieulacloi.fashionstore.api.repository;

import com.emhieulacloi.fashionstore.api.domains.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
}