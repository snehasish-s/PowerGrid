package com.tpcodl.powerpulse.enums;

/**
 * User roles within the PowerPulse AI platform.
 * Maps directly to Spring Security authorities.
 * 
 * - ADMIN: Full system access, user management, configuration
 * - FIELD_ENGINEER: Asset inspections, fault reporting, field operations
 * - MAINTENANCE_MANAGER: Maintenance scheduling, work order management
 * - EXECUTIVE: Read-only dashboards, reports, KPI oversight
 */
public enum Role {
    ADMIN,
    FIELD_ENGINEER,
    MAINTENANCE_MANAGER,
    EXECUTIVE
}
