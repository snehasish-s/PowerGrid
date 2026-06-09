package com.tpcodl.powerpulse.enums;

/**
 * Types of maintenance activities.
 * Aligns with TPCODL's maintenance management framework.
 */
public enum MaintenanceType {
    /** Scheduled routine maintenance (e.g., quarterly transformer oil check) */
    PREVENTIVE,

    /** Repair after fault detection (e.g., replacing blown fuse) */
    CORRECTIVE,

    /** Urgent unplanned maintenance due to critical failure */
    EMERGENCY,

    /** AI/ML-driven maintenance based on failure predictions */
    PREDICTIVE
}
