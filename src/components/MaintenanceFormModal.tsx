import { useState } from 'react';
import { X, Clock, MapPin, Wrench, User } from 'lucide-react';
import { MaintenanceType } from '../types/maintenance';
import { useMaintenanceContext } from '../context/MaintenanceContext';
import { MAINTENANCE_TYPES } from '../constants';
import { formatTime } from '../utils/dateUtils';
import { GlassCard } from './GlassCard';
import { addMaintenanceRecord } from '../lib/supabase';

interface MaintenanceFormModalProps {
  onClose: () => void;
}

const initialFormState = {
  type: 'MAINTENANCE_CALL' as MaintenanceType,
  description: '',
  location: '',
  technician: '',
};

export function MaintenanceFormModal({ onClose }: MaintenanceFormModalProps) {
  const { dispatch } = useMaintenanceContext();
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const startTime = new Date().toISOString();

  const validateForm = () => {
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.location.trim()) return 'Location is required';
    if (!formData.technician.trim()) return 'Technician initials are required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError(null);
    setIsSubmitting(true);

    try {
      const newRecord = {
        id: crypto.randomUUID(),
        ...formData,
        startTime,
        causedDowntime: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addMaintenanceRecord(newRecord);
      dispatch({ type: 'ADD_RECORD', payload: newRecord });
      onClose();
    } catch (error) {
      setError('Failed to create maintenance record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <GlassCard className="w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            Starting Call At <span className="text-blue-400">{formatTime(startTime)}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Maintenance Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as MaintenanceType })}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white"
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
              Description
            </label>
            <div className="relative">
              <Wrench className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2.5 text-white"
                placeholder="Describe the issue..."
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
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2.5 text-white"
                placeholder="Specify location..."
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Technician Initials
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={formData.technician}
                onChange={(e) => setFormData({ ...formData, technician: e.target.value.toUpperCase() })}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2.5 text-white"
                placeholder="Your initials..."
                maxLength={3}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-700/50">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <Clock className="h-5 w-5" />
              {isSubmitting ? 'Starting...' : 'Start Call'}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}