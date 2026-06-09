package com.tpcodl.powerpulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Outage entity — tracks power outage events across TPCODL zones.
 * 
 * Records the zone affected, number of impacted customers,
 * start/end times, root cause, and the asset responsible.
 * 
 * Duration is computed as (endTime - startTime).
 * Open outages have endTime = null.
 */
@Entity
@Table(name = "outages", indexes = {
    @Index(name = "idx_outage_zone", columnList = "zone"),
    @Index(name = "idx_outage_active", columnList = "is_active"),
    @Index(name = "idx_outage_start", columnList = "start_time")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Outage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Human-readable outage reference (e.g., "OUT-BHU-20260609-001") */
    @NotBlank(message = "Outage ID is required")
    @Column(name = "outage_id", nullable = false, unique = true, length = 30)
    private String outageId;

    /** TPCODL zone affected (e.g., "Bhubaneswar", "Cuttack Zone-3") */
    @NotBlank(message = "Zone is required")
    @Column(nullable = false, length = 100)
    private String zone;

    /** Specific area/locality (e.g., "Patia, Chandrasekharpur") */
    @Column(name = "affected_area", length = 200)
    private String affectedArea;

    /** Number of customers impacted */
    @Column(name = "affected_customers")
    @Builder.Default
    private Integer affectedCustomers = 0;

    /** Outage start timestamp */
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    /** Outage end timestamp (null if still ongoing) */
    @Column(name = "end_time")
    private LocalDateTime endTime;

    /** Root cause of the outage (e.g., "Transformer failure", "Storm damage", "Overloading") */
    @Column(length = 200)
    private String cause;

    /** Outage type (e.g., "Planned", "Unplanned", "Emergency") */
    @Column(name = "outage_type", length = 20)
    @Builder.Default
    private String outageType = "Unplanned";

    /** Whether the outage is still ongoing */
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    /** Restoration notes and actions taken */
    @Column(name = "restoration_notes", columnDefinition = "TEXT")
    private String restorationNotes;

    // ---- Audit Fields ----

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ---- Relationships ----

    /** The asset that caused the outage (nullable — some outages aren't asset-specific) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id")
    private Asset asset;
}
