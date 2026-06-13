package com.jsy.site.modules.auth.entrypoint;

import com.jsy.site.modules.auth.domain.model.User;
import com.jsy.site.modules.auth.domain.model.UserRole;
import com.jsy.site.modules.auth.domain.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserManagementController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserManagementController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<Map<String, String>> listUsers() {
        return userRepository.findAll().stream()
                .map(u -> Map.of("id", u.getId(), "username", u.getUsername(), "role", u.getRole().name()))
                .toList();
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest req) {
        if (userRepository.findByUsername(req.username()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "用户名已存在"));
        }
        User user = new User(UUID.randomUUID().toString(), req.username(),
                passwordEncoder.encode(req.password()), UserRole.valueOf(req.role()));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "创建成功"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "删除成功"));
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(@PathVariable String id, @RequestBody ChangePasswordRequest req) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        user.setPasswordHash(passwordEncoder.encode(req.newPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "密码修改成功"));
    }

    public record CreateUserRequest(String username, String password, String role) {}
    public record ChangePasswordRequest(String newPassword) {}
}
