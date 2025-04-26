package com.aspira.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;

import com.aspira.backend.service.CustomOAuth2UserService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configure(http))
                .authorizeHttpRequests(auth -> auth
                        // Authentication endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/users/check-email").permitAll()
                        .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()

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
                        )
                        .oauth2Login(oauth2 -> oauth2
                            .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)
                            )
                            .defaultSuccessUrl("http://localhost:5173/", true)
                        );
                    return http.build();
                }
    }


