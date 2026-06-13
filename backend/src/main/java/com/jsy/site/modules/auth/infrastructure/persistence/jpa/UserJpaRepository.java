package com.jsy.site.modules.auth.infrastructure.persistence.jpa;

import com.jsy.site.modules.auth.domain.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserJpaRepository extends JpaRepository<UserEntity, String> {
    Optional<UserEntity> findByUsername(String username);
    List<UserEntity> findAllByRole(UserRole role);
}
