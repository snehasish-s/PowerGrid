-- ============================================================
-- PowerPulse AI — Complete MySQL Schema
-- TPCODL Smart Utility Asset Intelligence Platform
-- ============================================================
-- Timezone: Asia/Kolkata (IST)
-- Charset: utf8mb4 (supports Hindi/Odia text)
-- ============================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS powerpulse_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE powerpulse_db;

-- ============================================================
-- 1. USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(50)  NOT NULL UNIQUE,
    email           VARCHAR(100) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    full_name       VARCHAR(100) NOT NULL,
    phone           VARCHAR(20),
    role            VARCHAR(30)  NOT NULL COMMENT 'ADMIN | FIELD_ENGINEER | MAINTENANCE_MANAGER | EXECUTIVE',
    zone            VARCHAR(50)  COMMENT 'TPCODL zone: Bhubaneswar, Cuttack, Berhampur, etc.',
    employee_id     VARCHAR(20)  COMMENT 'TPCODL employee ID (e.g., EMP-10042)',
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_user_role (role),
    INDEX idx_user_zone (zone),
    INDEX idx_user_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. ASSETS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS assets (
    id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
    asset_id             VARCHAR(20)  NOT NULL UNIQUE COMMENT 'e.g., TR-1001, FD-2003',
    asset_name           VARCHAR(150) NOT NULL COMMENT 'Descriptive name',
    asset_type           VARCHAR(20)  NOT NULL COMMENT 'TRANSFORMER | FEEDER | POLE | METER | SWITCHGEAR | CABLE',
    status               VARCHAR(20)  NOT NULL COMMENT 'OPERATIONAL | DEGRADED | FAULTY | DECOMMISSIONED',
    location             VARCHAR(255) COMMENT 'Physical location (e.g., Moradabad Sector-5)',
    zone                 VARCHAR(50)  NOT NULL COMMENT 'TPCODL distribution zone',
    latitude             DOUBLE       COMMENT 'GPS latitude for map overlay',
    longitude            DOUBLE       COMMENT 'GPS longitude for map overlay',
    manufacturer         VARCHAR(100) COMMENT 'e.g., Crompton Greaves, ABB India',
    model                VARCHAR(100) COMMENT 'Model/specification',
    installation_date    DATE         COMMENT 'Date of commissioning',
    rated_capacity       VARCHAR(50)  COMMENT 'e.g., 5 MVA, 400A',
    voltage_level        VARCHAR(20)  COMMENT 'e.g., 33kV, 11kV, 0.4kV',
    last_maintenance_date DATE        COMMENT 'Last maintenance performed',
    health_score         INT          DEFAULT 100 COMMENT 'Overall health 0-100',
    is_active            BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_asset_id (asset_id),
    INDEX idx_asset_zone (zone),
    INDEX idx_asset_status (status),
    INDEX idx_asset_type (asset_type),
    INDEX idx_asset_health (health_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. FAULTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS faults (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    fault_id            VARCHAR(30)  NOT NULL UNIQUE COMMENT 'e.g., FLT-20260601-001',
    fault_type          VARCHAR(100) NOT NULL COMMENT 'e.g., Oil Leakage, Overheating',
    severity            VARCHAR(10)  NOT NULL COMMENT 'LOW | MEDIUM | HIGH | CRITICAL',
    description         TEXT,
    reported_at         DATETIME     NOT NULL,
    resolved_at         DATETIME     COMMENT 'NULL if still open',
    resolution_notes    TEXT,
    is_resolved         BOOLEAN      NOT NULL DEFAULT FALSE,
    affected_customers  INT          DEFAULT 0,
    asset_id            BIGINT       NOT NULL,
    reported_by_user_id BIGINT,
    created_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_fault_asset FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    CONSTRAINT fk_fault_reporter FOREIGN KEY (reported_by_user_id) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_fault_severity (severity),
    INDEX idx_fault_resolved (is_resolved),
    INDEX idx_fault_reported_at (reported_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. MAINTENANCE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS maintenance (
    id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
    work_order_id        VARCHAR(30)  NOT NULL UNIQUE COMMENT 'e.g., WO-20260609-001',
    maintenance_type     VARCHAR(20)  NOT NULL COMMENT 'PREVENTIVE | CORRECTIVE | EMERGENCY | PREDICTIVE',
    status               VARCHAR(20)  NOT NULL COMMENT 'SCHEDULED | IN_PROGRESS | COMPLETED | OVERDUE',
    title                VARCHAR(200) NOT NULL,
    description          TEXT,
    scheduled_date       DATE         NOT NULL,
    completed_date       DATE,
    estimated_cost       DOUBLE       COMMENT 'Cost in INR',
    actual_cost          DOUBLE       COMMENT 'Actual cost in INR',
    priority             INT          NOT NULL DEFAULT 3 COMMENT '1=highest, 5=lowest',
    notes                TEXT,
    asset_id             BIGINT       NOT NULL,
    assigned_to_user_id  BIGINT,
    created_at           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_maint_asset FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    CONSTRAINT fk_maint_assignee FOREIGN KEY (assigned_to_user_id) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_maint_status (status),
    INDEX idx_maint_type (maintenance_type),
    INDEX idx_maint_scheduled (scheduled_date),
    INDEX idx_maint_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. INSPECTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS inspections (
    id                       BIGINT AUTO_INCREMENT PRIMARY KEY,
    inspection_id            VARCHAR(30)  NOT NULL UNIQUE COMMENT 'e.g., INS-20260609-001',
    inspection_date          DATE         NOT NULL,
    condition_score          INT          NOT NULL COMMENT '0 (critical) to 100 (pristine)',
    findings                 TEXT,
    recommended_actions      TEXT,
    requires_immediate_action BOOLEAN     NOT NULL DEFAULT FALSE,
    inspection_type          VARCHAR(50)  COMMENT 'Visual, Thermal Imaging, Oil Analysis, etc.',
    next_inspection_date     DATE,
    asset_id                 BIGINT       NOT NULL,
    inspector_user_id        BIGINT       NOT NULL,
    created_at               DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at               DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_insp_asset FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    CONSTRAINT fk_insp_inspector FOREIGN KEY (inspector_user_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_insp_date (inspection_date),
    INDEX idx_insp_score (condition_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. PREDICTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS predictions (
    id                       BIGINT AUTO_INCREMENT PRIMARY KEY,
    prediction_id            VARCHAR(30)  NOT NULL UNIQUE COMMENT 'e.g., PRD-20260609-001',
    failure_probability      DOUBLE       NOT NULL COMMENT '0.0 to 1.0',
    predicted_failure_date   DATE,
    failure_mode             VARCHAR(150) COMMENT 'e.g., Winding Insulation Breakdown',
    confidence_score         DOUBLE       COMMENT '0.0 to 1.0',
    model_version            VARCHAR(50)  COMMENT 'e.g., xgboost-v1.2.0',
    recommended_action       TEXT,
    prediction_horizon_days  INT          DEFAULT 30,
    action_taken             BOOLEAN      NOT NULL DEFAULT FALSE,
    asset_id                 BIGINT       NOT NULL,
    created_at               DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pred_asset FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,

    INDEX idx_pred_probability (failure_probability),
    INDEX idx_pred_date (predicted_failure_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. INVENTORY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_code      VARCHAR(30)  NOT NULL UNIQUE COMMENT 'e.g., INV-BHU-001',
    item_name      VARCHAR(150) NOT NULL,
    category       VARCHAR(50)  NOT NULL COMMENT 'Transformer Parts, Cables, Metering, etc.',
    quantity       INT          NOT NULL DEFAULT 0,
    unit           VARCHAR(20)  DEFAULT 'Nos',
    reorder_level  INT          NOT NULL DEFAULT 10,
    unit_price     DOUBLE       COMMENT 'Price in INR',
    warehouse      VARCHAR(100) NOT NULL COMMENT 'Warehouse location',
    supplier       VARCHAR(100),
    is_low_stock   BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_inv_category (category),
    INDEX idx_inv_warehouse (warehouse),
    INDEX idx_inv_low_stock (is_low_stock)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. OUTAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS outages (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    outage_id           VARCHAR(30)  NOT NULL UNIQUE COMMENT 'e.g., OUT-BHU-20260609-001',
    zone                VARCHAR(100) NOT NULL,
    affected_area       VARCHAR(200),
    affected_customers  INT          DEFAULT 0,
    start_time          DATETIME     NOT NULL,
    end_time            DATETIME     COMMENT 'NULL if still ongoing',
    cause               VARCHAR(200),
    outage_type         VARCHAR(20)  DEFAULT 'Unplanned' COMMENT 'Planned | Unplanned | Emergency',
    is_active           BOOLEAN      NOT NULL DEFAULT TRUE,
    restoration_notes   TEXT,
    asset_id            BIGINT       COMMENT 'Nullable — some outages not asset-specific',
    created_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_outage_asset FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE SET NULL,

    INDEX idx_outage_zone (zone),
    INDEX idx_outage_active (is_active),
    INDEX idx_outage_start (start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEED DATA — Default Admin User
-- Password: Admin@2026! (BCrypt-hashed)
-- ============================================================
INSERT IGNORE INTO users (username, email, password, full_name, phone, role, zone, employee_id, is_active)
VALUES (
    'admin',
    'admin@tpcodl.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'System Administrator',
    '+91-9000000001',
    'ADMIN',
    'Bhubaneswar',
    'EMP-10001',
    TRUE
);

-- Default Field Engineer
INSERT IGNORE INTO users (username, email, password, full_name, phone, role, zone, employee_id, is_active)
VALUES (
    'rajesh.engineer',
    'engineer@tpcodl.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Rajesh Kumar Patel',
    '+91-9000000002',
    'FIELD_ENGINEER',
    'Cuttack',
    'EMP-10042',
    TRUE
);

-- Default Maintenance Manager
INSERT IGNORE INTO users (username, email, password, full_name, phone, role, zone, employee_id, is_active)
VALUES (
    'priya.manager',
    'manager@tpcodl.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Priya Sharma',
    '+91-9000000003',
    'MAINTENANCE_MANAGER',
    'Bhubaneswar',
    'EMP-10015',
    TRUE
);

-- Default Executive
INSERT IGNORE INTO users (username, email, password, full_name, phone, role, zone, employee_id, is_active)
VALUES (
    'amit.executive',
    'executive@tpcodl.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Amit Mohanty',
    '+91-9000000004',
    'EXECUTIVE',
    'Bhubaneswar',
    'EMP-10005',
    TRUE
);

-- ============================================================
-- SEED DATA — Sample Assets (Indian Utility Context)
-- ============================================================
INSERT IGNORE INTO assets (asset_id, asset_name, asset_type, status, location, zone, latitude, longitude, manufacturer, model, installation_date, rated_capacity, voltage_level, health_score) VALUES
('TR-1001', '33/11kV Power Transformer — Moradabad Sector-5', 'TRANSFORMER', 'OPERATIONAL', 'Moradabad Sector-5, Near SBI Bank', 'Bhubaneswar', 20.2961, 85.8245, 'Crompton Greaves', 'CGL 33kV 5MVA ONAN', '2019-03-15', '5 MVA', '33kV', 92),
('TR-1002', '33/11kV Distribution Transformer — Saheed Nagar', 'TRANSFORMER', 'DEGRADED', 'Saheed Nagar, Main Road Junction', 'Bhubaneswar', 20.2856, 85.8462, 'ABB India', 'ABB 33kV 3MVA ONAN', '2017-06-20', '3 MVA', '33kV', 64),
('FD-2001', '11kV Feeder — Patia Industrial', 'FEEDER', 'OPERATIONAL', 'Patia Industrial Area, KIIT Road', 'Bhubaneswar', 20.3540, 85.8190, 'Siemens India', 'Siemens 11kV HV', '2020-01-10', '400A', '11kV', 88),
('FD-2003', '11kV Feeder — Cuttack Ring Main', 'FEEDER', 'FAULTY', 'Cuttack Ring Road, Near Barabati', 'Cuttack', 20.4625, 85.8828, 'L&T Electrical', 'LT 11kV RMU', '2018-09-05', '630A', '11kV', 35),
('PL-3045', 'RCC Pole — Mancheswar Colony', 'POLE', 'OPERATIONAL', 'Mancheswar Industrial Estate', 'Bhubaneswar', 20.3100, 85.8380, 'Odisha Cement', 'RCC 9m Standard', '2016-04-12', 'N/A', '0.4kV', 78),
('MT-4012', 'Smart Meter — Jharpada Residential', 'METER', 'OPERATIONAL', 'Jharpada Housing Board Colony', 'Bhubaneswar', 20.2740, 85.8100, 'Genus Power', 'Genus Smart 3-Phase', '2023-02-28', '100A', '0.4kV', 95),
('SG-5008', '33kV SF6 Circuit Breaker — Berhampur SS', 'SWITCHGEAR', 'OPERATIONAL', 'Berhampur 132kV Substation', 'Berhampur', 19.3110, 84.7940, 'Schneider Electric', 'SE SF6 33kV', '2021-07-15', '1250A', '33kV', 90),
('CB-6021', '11kV XLPE Underground Cable — Sambalpur', 'CABLE', 'DEGRADED', 'Sambalpur City Center, Budharaja', 'Sambalpur', 21.4669, 83.9812, 'Havells India', 'Havells 11kV 3C XLPE', '2015-11-22', '300 sqmm', '11kV', 55);
