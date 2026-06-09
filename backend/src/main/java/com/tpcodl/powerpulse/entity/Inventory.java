package com.tpcodl.powerpulse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Inventory entity — spare parts and materials warehouse management.
 * 
 * Tracks stock levels across TPCODL warehouses with reorder alerts
 * when quantity drops below reorderLevel threshold.
 * 
 * Example items:
 *   - "33kV Bushing" — Bhubaneswar Central Warehouse
 *   - "11kV Fuse Link 100A" — Cuttack Field Store
 *   - "Transformer Oil (Servo Electra-21)" — Regional Depot
 */
@Entity
@Table(name = "inventory", indexes = {
    @Index(name = "idx_inv_category", columnList = "category"),
    @Index(name = "idx_inv_warehouse", columnList = "warehouse")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Human-readable inventory item code (e.g., "INV-BHU-001") */
    @NotBlank(message = "Item code is required")
    @Column(name = "item_code", nullable = false, unique = true, length = 30)
    private String itemCode;

    /** Descriptive item name (e.g., "33kV Lightning Arrester") */
    @NotBlank(message = "Item name is required")
    @Column(name = "item_name", nullable = false, length = 150)
    private String itemName;

    /** Category classification (e.g., "Transformer Parts", "Cables", "Metering", "Safety Equipment") */
    @NotBlank(message = "Category is required")
    @Column(nullable = false, length = 50)
    private String category;

    /** Current stock quantity */
    @Min(0)
    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 0;

    /** Unit of measurement (e.g., "Nos", "Litres", "Metres", "Sets") */
    @Column(length = 20)
    @Builder.Default
    private String unit = "Nos";

    /** Reorder threshold — triggers alert when quantity falls below */
    @Column(name = "reorder_level", nullable = false)
    @Builder.Default
    private Integer reorderLevel = 10;

    /** Unit price in INR */
    @Column(name = "unit_price")
    private Double unitPrice;

    /** Warehouse/store location (e.g., "Bhubaneswar Central Warehouse") */
    @NotBlank(message = "Warehouse is required")
    @Column(nullable = false, length = 100)
    private String warehouse;

    /** Supplier name (e.g., "Crompton Greaves Ltd.") */
    @Column(length = 100)
    private String supplier;

    /** Whether the item is below reorder level */
    @Column(name = "is_low_stock", nullable = false)
    @Builder.Default
    private Boolean isLowStock = false;

    // ---- Audit Fields ----

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
