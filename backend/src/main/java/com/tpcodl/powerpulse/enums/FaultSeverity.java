package com.tpcodl.powerpulse.enums;

/**
 * Fault severity classification.
 * Determines escalation priority and SLA timelines.
 */
public enum FaultSeverity {
    /** Minor issue — no service disruption (e.g., cosmetic pole damage) */
    LOW,

    /** Moderate issue — potential service impact (e.g., transformer overheating) */
    MEDIUM,

    /** Major issue — active service disruption (e.g., feeder tripping) */
    HIGH,

    /** Emergency — widespread outage or safety hazard (e.g., transformer explosion) */
    CRITICAL
}
