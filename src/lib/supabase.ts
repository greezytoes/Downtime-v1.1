import { createClient } from '@supabase/supabase-js';
import type { MaintenanceRecord } from '../types/maintenance';

const supabaseUrl = 'https://znbqebirsgttpnvfdpzq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuYnFlYmlyc2d0dHBudmZkcHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2NjAzODUsImV4cCI6MjA0NjIzNjM4NX0.xz0gjqi2ZFM1L5i0f_1ApW3y9aL6ECrgDHvc8-b-wi4';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchMaintenanceRecords(): Promise<MaintenanceRecord[]> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('maintenance_records')
    .select('*')
    .gte('starttime', startOfDay.toISOString())
    .order('starttime', { ascending: true });

  if (error) {
    console.error('Error fetching records:', error);
    throw new Error('Failed to fetch maintenance records');
  }

  return (data || []).map(record => ({
    ...record,
    startTime: record.starttime,
    endTime: record.endtime,
    createdAt: record.createdat,
    updatedAt: record.updatedat,
    causedDowntime: record.causeddowntime,
    actualIssue: record.actualissue,
    partsUsed: record.partsused,
    partsNeeded: record.partsneeded
  }));
}

export async function addMaintenanceRecord(record: MaintenanceRecord) {
  const { error } = await supabase
    .from('maintenance_records')
    .insert([{
      id: record.id,
      type: record.type,
      starttime: record.startTime,
      endtime: record.endTime,
      description: record.description,
      location: record.location,
      technician: record.technician,
      resolution: record.resolution,
      partsused: record.partsUsed,
      partsneeded: record.partsNeeded,
      actualissue: record.actualIssue,
      causeddowntime: record.causedDowntime,
      createdat: record.createdAt,
      updatedat: record.updatedAt
    }]);

  if (error) {
    console.error('Error adding record:', error);
    throw new Error('Failed to add maintenance record');
  }
}

export async function updateMaintenanceRecord(record: MaintenanceRecord) {
  const { error } = await supabase
    .from('maintenance_records')
    .update({
      type: record.type,
      starttime: record.startTime,
      endtime: record.endTime,
      description: record.description,
      location: record.location,
      technician: record.technician,
      resolution: record.resolution,
      partsused: record.partsUsed,
      partsneeded: record.partsNeeded,
      actualissue: record.actualIssue,
      causeddowntime: record.causedDowntime,
      updatedat: record.updatedAt
    })
    .eq('id', record.id);

  if (error) {
    console.error('Error updating record:', error);
    throw new Error('Failed to update maintenance record');
  }
}