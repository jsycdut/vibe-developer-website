package com.jsy.site.bootstrap.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/notes", "/api/notes/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/notes/*/comments").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/notes/*/comments").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/upload").permitAll()
                        .requestMatchers("/files/**").permitAll()
                        .requestMatchers("/ws-connect/**").permitAll()
                        .requestMatchers("/api/article/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/notes").hasAnyRole("EDITOR", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/notes/**").hasAnyRole("EDITOR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/notes/**").hasAnyRole("EDITOR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/comments/**").hasRole("ADMIN")
                        .requestMatchers("/api/chat/**").hasAnyRole("CHATTER", "ADMIN")
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Bean 名称必须是 corsConfigurationSource，Spring Security 6 会自动查找此名称
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(java.util.List.of("*"));
        config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(java.util.List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
