package com.aspira.backend.config;

import com.aspira.backend.security.JwtAuthenticationFilter;
import com.aspira.backend.service.CustomOAuth2UserService;
import com.aspira.backend.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final CustomOAuth2UserService customOAuth2UserService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthFilter) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                // Permit all OPTIONS requests for CORS preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Auth module & specific public API endpoints
                .requestMatchers("/api/auth/**", "/oauth2/**", "/login/oauth2/**", "/error", "/api/greeting").permitAll()
                .requestMatchers("/test-database-connection").permitAll() // Consolidated duplicate
                
                // User related public endpoints
                .requestMatchers("/api/users/check-email").permitAll() // Explicitly for GET /api/users/check-email from logs
                .requestMatchers(HttpMethod.POST, "/api/users").permitAll() // Explicitly for POST /api/users (user creation)
                .requestMatchers(HttpMethod.GET, "/api/users/email").permitAll() // If you also have /api/users/email endpoint for GET
                .requestMatchers(HttpMethod.GET, "/api/users/{userId:\\d+}").permitAll() // For public user profiles
                
                // Other broadly permitted modules from your previous config
                .requestMatchers("/api/users/**").permitAll() // Covers other /api/users GET requests if any
                .requestMatchers("/api/posts/**").permitAll()
                .requestMatchers("/api/media/**").permitAll()
                .requestMatchers("/api/reactions/**").permitAll()
                .requestMatchers("/api/savedPosts/**").permitAll()
                .requestMatchers("/api/comments/**").permitAll()
                .requestMatchers("/api/notifications/**").permitAll()


                //Skill share module
                //Group module
                //Game hub module

                
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // For JWT
            )
            .authenticationProvider(authenticationProvider()) 
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(customOAuth2UserService)
                )
                .defaultSuccessUrl("http://localhost:5173/home", true)
            );

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return customUserDetailsService;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}


