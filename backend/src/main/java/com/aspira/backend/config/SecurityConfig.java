package com.aspira.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

import com.aspira.backend.service.CustomOAuth2UserService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF protection
            .authorizeHttpRequests(auth -> auth
               //interactivity module
                .requestMatchers("/api/users/**").permitAll() // Allow unauthenticated access to /api/users
                .requestMatchers("/api/posts/**").permitAll() // Allow unauthenticated access to /api/posts
                .requestMatchers("/api/media/**").permitAll() // Allow unauthenticated access to /api/media
                .requestMatchers("/api/reactions/**").permitAll() // Allow unauthenticated access to /api/reactions
                .requestMatchers("/api/saved-posts/**").permitAll() // Allow unauthenticated access to /api/saved-posts
                .requestMatchers("/api/comments/**").permitAll() // Allow unauthenticated access to /api/comments
                .requestMatchers("/api/notifications/**").permitAll() // Allow unauthenticated access to /api/comments
                .requestMatchers("/test-database-connection").permitAll() // Allow unauthenticated access to /api/comments

               //skill share module



               //Group module



               //Game Hub module

                .anyRequest().authenticated() // Require authentication for other endpoints
            );

        return http.build();
    }
}
