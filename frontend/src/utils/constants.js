export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const ROLES = {
  ADMIN: 'ADMIN',
  FIELD_ENGINEER: 'FIELD_ENGINEER',
  MAINTENANCE_MANAGER: 'MAINTENANCE_MANAGER',
  EXECUTIVE: 'EXECUTIVE'
};

export const ASSET_TYPES = {
  TRANSFORMER: 'TRANSFORMER',
  FEEDER: 'FEEDER',
  POLE: 'POLE',
  METER: 'METER',
  SWITCHGEAR: 'SWITCHGEAR',
  CABLE: 'CABLE'
};

export const ASSET_STATUS = {
  OPERATIONAL: 'OPERATIONAL',
  DEGRADED: 'DEGRADED',
  FAULTY: 'FAULTY',
  DECOMMISSIONED: 'DECOMMISSIONED'
};

export const SEVERITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

export const ZONES = [
  'Bhubaneswar',
  'Cuttack',
  'Berhampur',
  'Sambalpur',
  'Rourkela',
  'Balasore'
];
