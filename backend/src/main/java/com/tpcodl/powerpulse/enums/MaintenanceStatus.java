package com.tpcodl.powerpulse.enums;

/**
 * Maintenance work order status.
 * Tracks lifecycle from scheduling through completion.
 */
public enum MaintenanceStatus {
    /** Work order created and scheduled for future date */
    SCHEDULED,

    /** Field team has started the maintenance activity */
    IN_PROGRESS,

    /** Maintenance activity completed and verified */
    COMPLETED,

    /** Scheduled date has passed without completion */
    OVERDUE
}
