package com.tpcodl.powerpulse.entity;

import com.tpcodl.powerpulse.enums.MaintenanceStatus;
import com.tpcodl.powerpulse.enums.MaintenanceType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Maintenance entity — tracks work orders for asset upkeep.
 * 
 * Supports four maintenance strategies:
 *   PREVENTIVE — Routine scheduled maintenance
 *   CORRECTIVE — Post-fault repairs
 *   EMERGENCY — Urgent unplanned work
 *   PREDICTIVE — AI/ML triggered maintenance
 * 
 * Linked to the target Asset and assigned User (field engineer or crew lead).
 */
@Entity
@Table(name = "maintenance", indexes = {
    @Index(name = "idx_maint_status", columnList = "status"),
    @Index(name = "idx_maint_type", columnList = "maintenance_type"),
    @Index(name = "idx_maint_scheduled", columnList = "scheduled_date")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Maintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Human-readable work order reference (e.g., "WO-20260609-001") */
    @Column(name = "work_order_id", nullable = false, unique = true, length = 30)
    private String workOrderId;

    /** Maintenance strategy category */
    @NotNull(message = "Maintenance type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "maintenance_type", nullable = false, length = 20)
    private MaintenanceType maintenanceType;

    /** Current work order status */
    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MaintenanceStatus status;

    /** Brief title (e.g., "Quarterly Oil Testing — TR-1001") */
    @Column(nullable = false, length = 200)
    private String title;

    /** Detailed description of maintenance work to be performed */
    @Column(columnDefinition = "TEXT")
    private String description;

    /** Scheduled date for the maintenance activity */
    @Column(name = "scheduled_date", nullable = false)
    private LocalDate scheduledDate;

    /** Actual completion date (null if not yet completed) */
    @Column(name = "completed_date")
    private LocalDate completedDate;

    /** Estimated cost in INR */
    @Column(name = "estimated_cost")
    private Double estimatedCost;

    /** Actual cost incurred in INR */
    @Column(name = "actual_cost")
    private Double actualCost;

    /** Priority level (1 = highest, 5 = lowest) */
    @Column(nullable = false)
    @Builder.Default
    private Integer priority = 3;

    /** Notes and observations from the maintenance crew */
    @Column(columnDefinition = "TEXT")
    private String notes;

    // ---- Audit Fields ----

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ---- Relationships ----

    /** The asset this maintenance is for */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    /** The user assigned to perform or supervise this maintenance */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_user_id")
    private User assignedTo;
}
