import { useState } from 'react';
import { AlertTriangle, Calendar, MapPin, User, Wrench, X } from 'lucide-react';
import { MaintenanceRecord, MaintenanceType } from '../types/maintenance';
import { TimeControl } from './TimeControl';
import { GlassCard } from './GlassCard';
import { useMaintenanceContext } from '../context/MaintenanceContext';
import { formatDate } from '../utils/dateUtils';
import { MAINTENANCE_TYPES } from '../constants';
import { updateMaintenanceRecord } from '../lib/supabase';

interface RecordModalProps {
  record: MaintenanceRecord;
  onClose: () => void;
}

const DowntimeIndicator = ({ downtime }: { downtime: boolean }) => (
  <div className="flex items-center gap-2">
    <AlertTriangle className="h-5 w-5" />
    <span className={downtime ? 'text-red-400' : 'text-green-400'}>
      Machine {downtime ? 'Down' : 'Not Down'}
    </span>
  </div>
);

export function RecordModal({ record, onClose }: RecordModalProps) {
  const { dispatch } = useMaintenanceContext();
  const [formData, setFormData] = useState<MaintenanceRecord>(record);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTimeChange = (field: 'startTime' | 'endTime', newTime: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: newTime,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await updateMaintenanceRecord(formData);
      dispatch({ type: 'UPDATE_RECORD', payload: formData });
      onClose();
    } catch (error) {
      setError('Failed to update maintenance record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Maintenance Record Details</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <div className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white">
                    {formatDate(formData.startTime)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Start Time
                </label>
                <TimeControl 
                  value={formData.startTime} 
                  onChange={(time) => handleTimeChange('startTime', time)}
                  readOnly={isSubmitting}
                />
              </div>

              {formData.endTime && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      End Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <div className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white">
                        {formatDate(formData.endTime)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      End Time
                    </label>
                    <TimeControl 
                      value={formData.endTime} 
                      onChange={(time) => handleTimeChange('endTime', time)}
                      readOnly={isSubmitting}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Maintenance Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as MaintenanceType })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                  disabled={isSubmitting}
                >
                  {MAINTENANCE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Technician
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.technician}
                    onChange={(e) => setFormData({ ...formData, technician: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white"
                    maxLength={3}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <div className="relative">
                <Wrench className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {formData.endTime && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Resolution
                  </label>
                  <textarea
                    value={formData.resolution || ''}
                    onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white min-h-[100px]"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.actualIssue || ''}
                    onChange={(e) => setFormData({ ...formData, actualIssue: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white min-h-[100px]"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="downtime"
                    checked={formData.causedDowntime}
                    onChange={(e) => setFormData({ ...formData, causedDowntime: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="downtime" className="text-sm text-slate-300">
                    Machine Down
                  </label>
                </div>
              </>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </GlassCard>
    </div>
  );
}