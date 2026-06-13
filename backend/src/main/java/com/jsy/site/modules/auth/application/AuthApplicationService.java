package com.jsy.site.modules.auth.application;

import com.jsy.site.bootstrap.config.JwtUtils;
import com.jsy.site.modules.auth.domain.model.User;
import com.jsy.site.modules.auth.domain.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthApplicationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthApplicationService(UserRepository userRepository,
                                   PasswordEncoder passwordEncoder,
                                   JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public String login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("用户名或密码错误"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("用户名或密码错误");
        }

        return jwtUtils.generate(user.getUsername(), user.getRole().name());
    }
}
