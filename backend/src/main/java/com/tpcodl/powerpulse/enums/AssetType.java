package com.tpcodl.powerpulse.enums;

/**
 * Types of electrical utility assets managed by TPCODL.
 * Used for asset classification and filtering across zones.
 */
public enum AssetType {
    /** Power/Distribution Transformer (e.g., TR-1001) */
    TRANSFORMER,

    /** 11kV/33kV Feeder line (e.g., FD-2003) */
    FEEDER,

    /** Utility pole — wooden, concrete, or steel (e.g., PL-3045) */
    POLE,

    /** Energy meter — residential, commercial, or industrial (e.g., MT-4012) */
    METER,

    /** Switchgear — circuit breakers, isolators (e.g., SG-5008) */
    SWITCHGEAR,

    /** Underground/overhead cable segments (e.g., CB-6021) */
    CABLE
}
