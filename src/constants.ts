import { MaintenanceType } from './types/maintenance';

export const MAINTENANCE_TYPES: { value: MaintenanceType; label: string }[] = [
  { value: 'MAINTENANCE_CALL', label: 'Maintenance Call' },
  { value: 'PREVENTATIVE', label: 'Preventative Maintenance' },
  { value: 'PROACTIVE', label: 'Proactive Maintenance' },
  { value: 'PROJECT', label: 'Project' },
  { value: '4S_D', label: '4S+D Activity' },
];