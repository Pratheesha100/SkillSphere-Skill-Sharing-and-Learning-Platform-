package com.aspira.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configure(http))
            .authorizeHttpRequests(auth -> auth
                // Authentication endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/users/check-email").permitAll()
                .requestMatchers("/oauth2/**").permitAll()
                .requestMatchers("/login/oauth2/**").permitAll()
                
                // Interactivity module
                .requestMatchers("/api/users/**").permitAll()
                .requestMatchers("/api/posts/**").permitAll()
                .requestMatchers("/api/media/**").permitAll()
                .requestMatchers("/api/reactions/**").permitAll()
                .requestMatchers("/api/saved-posts/**").permitAll()
                .requestMatchers("/api/comments/**").permitAll()
                .requestMatchers("/api/notifications/**").permitAll()
                .requestMatchers("/test-database-connection").permitAll()

                // Skill share module
                // Add your skill share module endpoints here

                // Group module
                // Add your group module endpoints here

                // Game Hub module
                // Add your game hub module endpoints here

                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        return http.build();
    }
}
