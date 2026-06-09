package com.tpcodl.powerpulse.enums;

/**
 * Operational status of a utility asset.
 * Drives dashboard KPIs and maintenance priority.
 */
public enum AssetStatus {
    /** Asset is functioning within normal parameters */
    OPERATIONAL,

    /** Asset shows signs of wear or partial failure — needs attention */
    DEGRADED,

    /** Asset has failed or is non-functional — immediate action required */
    FAULTY,

    /** Asset has been retired from active service */
    DECOMMISSIONED
}
