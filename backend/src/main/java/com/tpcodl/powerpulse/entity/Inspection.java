package com.tpcodl.powerpulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Inspection entity — records field inspection results for assets.
 * 
 * Inspectors (Field Engineers) visit assets and record:
 *   - Overall condition score (0–100)
 *   - Detailed findings and observations
 *   - Recommended follow-up actions
 * 
 * Inspection scores feed into the asset's health_score calculation.
 */
@Entity
@Table(name = "inspections", indexes = {
    @Index(name = "idx_insp_date", columnList = "inspection_date"),
    @Index(name = "idx_insp_score", columnList = "condition_score")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Inspection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Human-readable inspection reference (e.g., "INS-20260609-001") */
    @Column(name = "inspection_id", nullable = false, unique = true, length = 30)
    private String inspectionId;

    /** Date the inspection was conducted */
    @Column(name = "inspection_date", nullable = false)
    private LocalDate inspectionDate;

    /** Overall condition score — 0 (critical) to 100 (pristine) */
    @Min(0) @Max(100)
    @Column(name = "condition_score", nullable = false)
    private Integer conditionScore;

    /** Detailed findings from the inspection */
    @Column(columnDefinition = "TEXT")
    private String findings;

    /** Recommended actions based on inspection (e.g., "Schedule oil replacement within 30 days") */
    @Column(name = "recommended_actions", columnDefinition = "TEXT")
    private String recommendedActions;

    /** Whether the inspection flagged immediate attention required */
    @Column(name = "requires_immediate_action", nullable = false)
    @Builder.Default
    private Boolean requiresImmediateAction = false;

    /** Type of inspection (e.g., "Visual", "Thermal Imaging", "Oil Analysis", "Electrical Testing") */
    @Column(name = "inspection_type", length = 50)
    private String inspectionType;

    /** Next scheduled inspection date */
    @Column(name = "next_inspection_date")
    private LocalDate nextInspectionDate;

    // ---- Audit Fields ----

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ---- Relationships ----

    /** The asset that was inspected */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    /** The field engineer who conducted the inspection */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inspector_user_id", nullable = false)
    private User inspector;
}
