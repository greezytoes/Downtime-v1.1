import { useState } from 'react';
import { Clock, MapPin, Wrench, User } from 'lucide-react';
import { MaintenanceType } from '../types/maintenance';
import { GlassCard } from './GlassCard';
import { useMaintenanceContext } from '../context/MaintenanceContext';

const MAINTENANCE_TYPES: { value: MaintenanceType; label: string }[] = [
  { value: 'MAINTENANCE_CALL', label: 'Maintenance Call' },
  { value: 'PREVENTATIVE', label: 'Preventative Maintenance' },
  { value: 'PROACTIVE', label: 'Proactive Maintenance' },
  { value: 'PROJECT', label: 'Project' },
  { value: '4S_D', label: '4S+D Activity' },
];

const initialFormState = {
  type: 'MAINTENANCE_CALL' as MaintenanceType,
  description: '',
  location: '',
  technician: '',
};

export function MaintenanceForm() {
  const { dispatch } = useMaintenanceContext();
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.location.trim()) return 'Location is required';
    if (!formData.technician.trim()) return 'Technician initials are required';
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError(null);
    const newRecord = {
      id: crypto.randomUUID(),
      ...formData,
      startTime: new Date().toISOString(),
      causedDowntime: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_RECORD', payload: newRecord });
    setFormData(initialFormState);
  };

  return (
    <GlassCard className="p-6">
      <h2 className="text-xl font-semibold text-white mb-6">New Maintenance Record</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Maintenance Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as MaintenanceType })}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {MAINTENANCE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <div className="relative">
              <Wrench className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the issue..."
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Specify location..."
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Technician Initials
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={formData.technician}
                onChange={(e) => setFormData({ ...formData, technician: e.target.value.toUpperCase() })}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your initials..."
                maxLength={3}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Clock className="h-5 w-5" />
          Start Maintenance Record
        </button>
      </form>
    </GlassCard>
  );
}