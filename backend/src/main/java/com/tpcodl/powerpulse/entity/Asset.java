package com.tpcodl.powerpulse.entity;

import com.tpcodl.powerpulse.enums.AssetStatus;
import com.tpcodl.powerpulse.enums.AssetType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Asset entity — represents physical utility infrastructure across TPCODL zones.
 * 
 * Asset ID conventions (Indian utility context):
 *   TR-1001 → Transformer
 *   FD-2003 → Feeder
 *   PL-3045 → Pole
 *   MT-4012 → Meter
 *   SG-5008 → Switchgear
 *   CB-6021 → Cable
 * 
 * Coordinates (latitude/longitude) enable Leaflet map visualization.
 * Soft-delete via isActive flag — assets are decommissioned, never hard-deleted.
 */
@Entity
@Table(name = "assets", indexes = {
    @Index(name = "idx_asset_id", columnList = "asset_id"),
    @Index(name = "idx_asset_zone", columnList = "zone"),
    @Index(name = "idx_asset_status", columnList = "status"),
    @Index(name = "idx_asset_type", columnList = "asset_type")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Human-readable asset identifier (e.g., "TR-1001") */
    @NotBlank(message = "Asset ID is required")
    @Column(name = "asset_id", nullable = false, unique = true, length = 20)
    private String assetId;

    /** Descriptive name (e.g., "33/11kV Power Transformer — Moradabad Sector-5") */
    @NotBlank(message = "Asset name is required")
    @Column(name = "asset_name", nullable = false, length = 150)
    private String assetName;

    /** Asset category */
    @NotNull(message = "Asset type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "asset_type", nullable = false, length = 20)
    private AssetType assetType;

    /** Current operational status */
    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AssetStatus status;

    /** Physical location description (e.g., "Moradabad Sector-5, Near SBI Bank") */
    @Column(length = 255)
    private String location;

    /** TPCODL distribution zone (e.g., "Bhubaneswar", "Cuttack") */
    @Column(nullable = false, length = 50)
    private String zone;

    /** GPS latitude for map overlay */
    @Column
    private Double latitude;

    /** GPS longitude for map overlay */
    @Column
    private Double longitude;

    /** Manufacturer/make (e.g., "Crompton Greaves", "ABB India") */
    @Column(length = 100)
    private String manufacturer;

    /** Model or specification (e.g., "CGL 33kV 5MVA ONAN") */
    @Column(length = 100)
    private String model;

    /** Date the asset was installed/commissioned */
    @Column(name = "installation_date")
    private LocalDate installationDate;

    /** Rated capacity (e.g., "5 MVA", "400A") */
    @Column(name = "rated_capacity", length = 50)
    private String ratedCapacity;

    /** Voltage level (e.g., "33kV", "11kV", "0.4kV") */
    @Column(name = "voltage_level", length = 20)
    private String voltageLevel;

    /** Date of last maintenance activity */
    @Column(name = "last_maintenance_date")
    private LocalDate lastMaintenanceDate;

    /** Overall health score (0-100) computed from inspections and predictions */
    @Column(name = "health_score")
    @Builder.Default
    private Integer healthScore = 100;

    /** Soft delete flag */
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

    /** Faults recorded against this asset */
    @OneToMany(mappedBy = "asset", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Fault> faults = new ArrayList<>();

    /** Maintenance work orders for this asset */
    @OneToMany(mappedBy = "asset", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Maintenance> maintenanceRecords = new ArrayList<>();

    /** Inspection records for this asset */
    @OneToMany(mappedBy = "asset", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Inspection> inspections = new ArrayList<>();

    /** ML failure predictions for this asset */
    @OneToMany(mappedBy = "asset", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Prediction> predictions = new ArrayList<>();
}
