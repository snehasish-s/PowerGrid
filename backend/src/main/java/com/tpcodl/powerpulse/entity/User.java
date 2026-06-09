package com.tpcodl.powerpulse.entity;

import com.tpcodl.powerpulse.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * User entity — represents platform users across TPCODL.
 * 
 * Roles:
 *   ADMIN — Full system access, user management
 *   FIELD_ENGINEER — Field inspections, fault reporting
 *   MAINTENANCE_MANAGER — Maintenance scheduling, crew assignment
 *   EXECUTIVE — Read-only dashboards and KPI reports
 * 
 * Implements soft-delete via isActive flag.
 */
@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "username"),
    @UniqueConstraint(columnNames = "email")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Unique login username (e.g., "rajesh.sharma") */
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50)
    @Column(nullable = false, unique = true, length = 50)
    private String username;

    /** Email address — used for notifications and password reset */
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    /** BCrypt-hashed password */
    @NotBlank(message = "Password is required")
    @Column(nullable = false)
    private String password;

    /** Full name for display (e.g., "Rajesh Kumar Sharma") */
    @NotBlank(message = "Full name is required")
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    /** Contact phone number (e.g., "+91-9876543210") */
    @Column(length = 20)
    private String phone;

    /** Platform role — determines access permissions */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Role role;

    /** TPCODL distribution zone assignment (e.g., "Bhubaneswar", "Cuttack") */
    @Column(length = 50)
    private String zone;

    /** Employee ID within TPCODL (e.g., "EMP-10042") */
    @Column(name = "employee_id", length = 20)
    private String employeeId;

    /** Soft delete — false means user account is deactivated */
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    // ---- Audit Fields ----

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ---- Relationships ----

    /** Faults reported by this user */
    @OneToMany(mappedBy = "reportedBy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Fault> reportedFaults = new ArrayList<>();

    /** Inspections conducted by this user */
    @OneToMany(mappedBy = "inspector", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Inspection> inspections = new ArrayList<>();

    /** Maintenance tasks assigned to this user */
    @OneToMany(mappedBy = "assignedTo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Maintenance> maintenanceTasks = new ArrayList<>();
}
