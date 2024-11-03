export type MaintenanceType = 
  | 'MAINTENANCE_CALL'
  | 'PREVENTATIVE'
  | 'PROACTIVE'
  | 'PROJECT'
  | '4S_D';

export interface MaintenanceRecord {
  id: string;
  type: MaintenanceType;
  startTime: string;
  endTime?: string;
  description: string;
  location: string;
  technician: string;
  resolution?: string;
  partsUsed?: string[];
  partsNeeded?: string[];
  actualIssue?: string;
  causedDowntime: boolean;
  createdAt: string;
  updatedAt: string;
}