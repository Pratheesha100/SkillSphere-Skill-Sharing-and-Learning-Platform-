package com.aspira.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF protection
            .authorizeHttpRequests(auth -> auth
                // Interactivity module
                .requestMatchers("/api/users/**").permitAll()
                .requestMatchers("/api/posts/**").permitAll()
                .requestMatchers("/api/media/**").permitAll()
                .requestMatchers("/api/reactions/**").permitAll()
                .requestMatchers("/api/saved-posts/**").permitAll()
                .requestMatchers("/api/comments/**").permitAll()
                .requestMatchers("/api/notifications/**").permitAll()
                .requestMatchers("/test-database-connection").permitAll()

                // Game Hub module ✅
                .requestMatchers("/api/games/**").permitAll()

                // Skill share module
                // Group module

                .anyRequest().authenticated() // Require authentication for other endpoints
            );

        return http.build();
    }
}
