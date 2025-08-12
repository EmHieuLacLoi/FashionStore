package com.emhieulacloi.fashionstore.api.repository;

import com.emhieulacloi.fashionstore.api.domains.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
