package com.jsy.site.modules.auth.domain.repository;

import com.jsy.site.modules.auth.domain.model.User;
import com.jsy.site.modules.auth.domain.model.UserRole;

import java.util.List;
import java.util.Optional;

public interface UserRepository {
    Optional<User> findByUsername(String username);
    Optional<User> findById(String id);
    void save(User user);
    void deleteById(String id);
    List<User> findAll();
    List<User> findAllByRole(UserRole role);
}
