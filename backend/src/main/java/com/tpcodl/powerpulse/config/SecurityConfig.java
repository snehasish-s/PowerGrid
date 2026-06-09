package com.tpcodl.powerpulse.config;

import com.tpcodl.powerpulse.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security Configuration — JWT-based stateless authentication.
 * 
 * Role-based access control:
 *   /api/auth/**          → Public (login, register)
 *   /api/admin/**         → ADMIN only
 *   /api/maintenance/**   → ADMIN, MAINTENANCE_MANAGER
 *   /api/inspections/**   → ADMIN, FIELD_ENGINEER, MAINTENANCE_MANAGER
 *   /api/predictions/**   → ADMIN, MAINTENANCE_MANAGER, EXECUTIVE
 *   /api/**               → All authenticated users
 * 
 * Stateless session management — no server-side sessions.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF — not needed for stateless JWT APIs
            .csrf(csrf -> csrf.disable())

            // Stateless session — no cookies or server sessions
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // URL-based authorization rules
            .authorizeHttpRequests(auth -> auth
                // Public endpoints — authentication
                .requestMatchers("/api/auth/**").permitAll()

                // Health check endpoint
                .requestMatchers("/api/health").permitAll()

                // Swagger/API docs (if added later)
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                // Admin-only endpoints
                .requestMatchers("/api/admin/**")
                    .hasAuthority("ADMIN")

                // Maintenance — Admin and Maintenance Manager
                .requestMatchers(HttpMethod.POST, "/api/maintenance/**")
                    .hasAnyAuthority("ADMIN", "MAINTENANCE_MANAGER")
                .requestMatchers(HttpMethod.PUT, "/api/maintenance/**")
                    .hasAnyAuthority("ADMIN", "MAINTENANCE_MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/api/maintenance/**")
                    .hasAuthority("ADMIN")

                // Inspections — Admin, Field Engineer, Maintenance Manager
                .requestMatchers(HttpMethod.POST, "/api/inspections/**")
                    .hasAnyAuthority("ADMIN", "FIELD_ENGINEER")
                .requestMatchers(HttpMethod.PUT, "/api/inspections/**")
                    .hasAnyAuthority("ADMIN", "FIELD_ENGINEER", "MAINTENANCE_MANAGER")

                // Predictions — Admin, Maintenance Manager, Executive
                .requestMatchers("/api/predictions/**")
                    .hasAnyAuthority("ADMIN", "MAINTENANCE_MANAGER", "EXECUTIVE")

                // Inventory — Admin and Maintenance Manager
                .requestMatchers(HttpMethod.POST, "/api/inventory/**")
                    .hasAnyAuthority("ADMIN", "MAINTENANCE_MANAGER")
                .requestMatchers(HttpMethod.PUT, "/api/inventory/**")
                    .hasAnyAuthority("ADMIN", "MAINTENANCE_MANAGER")

                // All other endpoints require authentication
                .anyRequest().authenticated()
            )

            // Set authentication provider
            .authenticationProvider(authenticationProvider())

            // Add JWT filter before Spring's UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
