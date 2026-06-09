package com.tpcodl.powerpulse.service;

import com.tpcodl.powerpulse.entity.User;
import com.tpcodl.powerpulse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

/**
 * Custom UserDetailsService — loads user data from MySQL for Spring Security.
 * 
 * Supports authentication by either username or email address.
 * Maps the User's Role enum to a Spring Security GrantedAuthority.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Load user by username OR email — both are accepted for login.
     * 
     * @param usernameOrEmail The login identifier
     * @return Spring Security UserDetails
     * @throws UsernameNotFoundException if no matching user is found
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // Try to find by username first, then by email
        User user = userRepository.findByUsername(usernameOrEmail)
                .orElseGet(() -> userRepository.findByEmail(usernameOrEmail)
                        .orElseThrow(() -> new UsernameNotFoundException(
                                "User not found with username or email: " + usernameOrEmail
                        ))
                );

        // Check if user account is active
        if (!user.getIsActive()) {
            throw new UsernameNotFoundException("User account is deactivated: " + usernameOrEmail);
        }

        // Map Role enum → Spring Security GrantedAuthority
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().name());

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.getIsActive(),     // enabled
                true,                   // accountNonExpired
                true,                   // credentialsNonExpired
                true,                   // accountNonLocked
                Collections.singletonList(authority)
        );
    }
}
