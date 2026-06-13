package com.jsy.site.modules.auth.infrastructure.persistence.jpa;

import com.jsy.site.modules.auth.domain.model.User;
import com.jsy.site.modules.auth.domain.model.UserRole;
import com.jsy.site.modules.auth.domain.repository.UserRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@ConditionalOnProperty(name = "site.orm-type", havingValue = "jpa", matchIfMissing = true)
public class UserRepositoryImpl implements UserRepository {

    private final UserJpaRepository jpa;

    public UserRepositoryImpl(UserJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return jpa.findByUsername(username).map(this::toDomain);
    }

    @Override
    public void save(User user) {
        jpa.save(toEntity(user));
    }

    @Override
    public Optional<User> findById(String id) {
        return jpa.findById(id).map(this::toDomain);
    }

    @Override
    public void deleteById(String id) {
        jpa.deleteById(id);
    }

    @Override
    public List<User> findAll() {
        return jpa.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public List<User> findAllByRole(UserRole role) {
        return jpa.findAllByRole(role).stream().map(this::toDomain).toList();
    }

    private User toDomain(UserEntity e) {
        return new User(e.getId(), e.getUsername(), e.getPasswordHash(), e.getRole());
    }

    private UserEntity toEntity(User u) {
        UserEntity e = new UserEntity();
        e.setId(u.getId());
        e.setUsername(u.getUsername());
        e.setPasswordHash(u.getPasswordHash());
        e.setRole(u.getRole());
        return e;
    }
}
