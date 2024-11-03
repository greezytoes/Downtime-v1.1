import { useState } from 'react';
import { X, Clock } from 'lucide-react';
import { MaintenanceRecord } from '../types/maintenance';
import { useMaintenanceContext } from '../context/MaintenanceContext';
import { TimeControl } from './TimeControl';
import { GlassCard } from './GlassCard';

interface EndCallModalProps {
  record: MaintenanceRecord;
  onClose: () => void;
}

export function EndCallModal({ record, onClose }: EndCallModalProps) {
  const { dispatch } = useMaintenanceContext();
  const [endTime, setEndTime] = useState(new Date().toISOString());
  const [formData, setFormData] = useState({
    resolution: '',
    actualIssue: '',
    causedDowntime: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedRecord = {
      ...record,
      ...formData,
      endTime,
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'UPDATE_RECORD', payload: updatedRecord });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <GlassCard className="w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <h2 className="text-xl font-semibold text-white">End Call</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              End Time
            </label>
            <TimeControl value={endTime} onChange={setEndTime} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Resolution
            </label>
            <textarea
              value={formData.resolution}
              onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white min-h-[100px]"
              placeholder="Describe how the issue was resolved..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.actualIssue}
              onChange={(e) => setFormData({ ...formData, actualIssue: e.target.value })}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white min-h-[100px]"
              placeholder="Any additional notes or findings..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="downtime"
              checked={formData.causedDowntime}
              onChange={(e) => setFormData({ ...formData, causedDowntime: e.target.checked })}
              className="rounded border-slate-700 bg-slate-800/50 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="downtime" className="text-sm text-slate-300">
              Machine Down
            </label>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-700/50">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Clock className="h-5 w-5" />
              Complete Call
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}