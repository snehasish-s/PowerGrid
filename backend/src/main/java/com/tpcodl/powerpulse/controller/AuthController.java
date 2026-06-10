package com.tpcodl.powerpulse.controller;

import com.tpcodl.powerpulse.config.JwtTokenProvider;
import com.tpcodl.powerpulse.dto.ApiResponse;
import com.tpcodl.powerpulse.dto.LoginRequest;
import com.tpcodl.powerpulse.dto.LoginResponse;
import com.tpcodl.powerpulse.dto.RegisterRequest;
import com.tpcodl.powerpulse.entity.User;
import com.tpcodl.powerpulse.enums.Role;
import com.tpcodl.powerpulse.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        // Fetch full user details to return in login response
        User user = userRepository.findByUsername(loginRequest.getUsernameOrEmail())
                .orElseGet(() -> userRepository.findByEmail(loginRequest.getUsernameOrEmail())
                        .orElseThrow(() -> new RuntimeException("User not found after authentication")));

        return ResponseEntity.ok(new LoginResponse(
                jwt,
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                user.getFullName(),
                user.getZone(),
                user.getEmployeeId()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Username is already taken!"));
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Email Address already in use!"));
        }

        // Creating user's account
        Role userRole = Role.FIELD_ENGINEER;
        try {
            if (registerRequest.getRole() != null) {
                userRole = Role.valueOf(registerRequest.getRole().toUpperCase());
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Invalid role. Must be ADMIN, FIELD_ENGINEER, MAINTENANCE_MANAGER, or EXECUTIVE"));
        }

        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .fullName(registerRequest.getFullName())
                .phone(registerRequest.getPhone())
                .role(userRole)
                .zone(registerRequest.getZone())
                .employeeId(registerRequest.getEmployeeId())
                .isActive(true)
                .build();

        userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse(true, "User registered successfully"));
    }
}
