package com.jsy.site.bootstrap.config;

import com.jsy.site.modules.auth.domain.model.User;
import com.jsy.site.modules.auth.domain.model.UserRole;
import com.jsy.site.modules.auth.domain.repository.UserRepository;
import java.util.UUID;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public void run(String... args) {
    createIfAbsent("admin", "admin123", UserRole.ADMIN);
  }

  private void createIfAbsent(String username, String password, UserRole role) {
    if (userRepository.findByUsername(username).isEmpty()) {
      userRepository.save(
          new User(UUID.randomUUID().toString(), username, passwordEncoder.encode(password), role));
    }
  }
}
