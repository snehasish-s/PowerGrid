package com.tpcodl.powerpulse.entity;

import com.tpcodl.powerpulse.enums.FaultSeverity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Fault entity — records equipment failures and anomalies.
 * 
 * Linked to the affected Asset and the User who reported the fault.
 * Severity levels drive SLA escalation timelines:
 *   CRITICAL → 2 hours
 *   HIGH → 8 hours
 *   MEDIUM → 24 hours
 *   LOW → 72 hours
 */
@Entity
@Table(name = "faults", indexes = {
    @Index(name = "idx_fault_severity", columnList = "severity"),
    @Index(name = "idx_fault_resolved", columnList = "is_resolved"),
    @Index(name = "idx_fault_reported_at", columnList = "reported_at")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Fault {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Human-readable fault reference (e.g., "FLT-20260601-001") */
    @NotBlank(message = "Fault ID is required")
    @Column(name = "fault_id", nullable = false, unique = true, length = 30)
    private String faultId;

    /** Classification of the fault type (e.g., "Oil Leakage", "Overheating", "Phase Failure") */
    @NotBlank(message = "Fault type is required")
    @Column(name = "fault_type", nullable = false, length = 100)
    private String faultType;

    /** Impact severity — drives SLA and escalation */
    @NotNull(message = "Severity is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private FaultSeverity severity;

    /** Detailed description of the fault (e.g., "Transformer oil temperature exceeded 95°C") */
    @Column(columnDefinition = "TEXT")
    private String description;

    /** When the fault was first reported */
    @Column(name = "reported_at", nullable = false)
    private LocalDateTime reportedAt;

    /** When the fault was resolved (null if still open) */
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    /** Resolution notes (e.g., "Replaced cooling fan, oil drained and refilled") */
    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    /** Whether the fault has been resolved */
    @Column(name = "is_resolved", nullable = false)
    @Builder.Default
    private Boolean isResolved = false;

    /** Number of customers affected by this fault */
    @Column(name = "affected_customers")
    @Builder.Default
    private Integer affectedCustomers = 0;

    // ---- Audit Fields ----

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ---- Relationships ----

    /** The asset affected by this fault */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    /** The user who reported this fault */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by_user_id")
    private User reportedBy;
}
