package com.tpcodl.powerpulse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Login response DTO — returns JWT token and user details after successful authentication.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String token;
    private String tokenType;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private String zone;

    /**
     * Convenience factory method for building the response.
     */
    public static LoginResponse of(String token, String username, String email,
                                    String fullName, String role, String zone) {
        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .username(username)
                .email(email)
                .fullName(fullName)
                .role(role)
                .zone(zone)
                .build();
    }
}
