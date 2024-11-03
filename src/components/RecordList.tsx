import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Edit2 } from 'lucide-react';
import { MaintenanceRecord } from '../types/maintenance';
import { GlassCard } from './GlassCard';
import { useMaintenanceContext } from '../context/MaintenanceContext';
import { RecordModal } from './RecordModal';

interface RecordListProps {
  onEndCall?: (id: string | null) => void;
  selectedToEnd?: string | null;
}

export function RecordList({ onEndCall, selectedToEnd }: RecordListProps) {
  const { state } = useMaintenanceContext();
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);

  const activeRecords = state.records.filter(record => !record.endTime);
  const completedRecords = state.records.filter(record => record.endTime)
    .sort((a, b) => new Date(b.endTime!).getTime() - new Date(a.endTime!).getTime())
    .slice(0, 5);

  useEffect(() => {
    if (selectedToEnd) {
      const record = state.records.find(r => r.id === selectedToEnd);
      if (record) {
        setSelectedRecord(record);
      }
    }
  }, [selectedToEnd, state.records]);

  const formatDuration = (start: string, end?: string) => {
    const duration = end 
      ? new Date(end).getTime() - new Date(start).getTime()
      : new Date().getTime() - new Date(start).getTime();
    const minutes = Math.floor(duration / (1000 * 60));
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const handleCloseModal = () => {
    setSelectedRecord(null);
    if (onEndCall) {
      onEndCall(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Active Records</h3>
          <div className="space-y-2">
            {activeRecords.length === 0 ? (
              <p className="text-slate-400 text-sm">No active maintenance records</p>
            ) : (
              activeRecords.map(record => (
                <GlassCard key={record.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{record.description}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                        <Clock className="h-4 w-4" />
                        <span>Duration: {formatDuration(record.startTime)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-5 w-5 text-blue-400" />
                    </button>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Recent Completed</h3>
          <div className="space-y-2">
            {completedRecords.length === 0 ? (
              <p className="text-slate-400 text-sm">No completed maintenance records</p>
            ) : (
              completedRecords.map(record => (
                <GlassCard key={record.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{record.description}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                        <Clock className="h-4 w-4" />
                        <span>Duration: {formatDuration(record.startTime, record.endTime)}</span>
                        {record.causedDowntime ? (
                          <span className="flex items-center gap-1 text-red-400">
                            <XCircle className="h-4 w-4" /> Caused Downtime
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-green-400">
                            <CheckCircle className="h-4 w-4" /> No Downtime
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-5 w-5 text-blue-400" />
                    </button>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedRecord && (
        <RecordModal
          record={selectedRecord}
          onClose={handleCloseModal}
          autoOpenComplete={selectedRecord.id === selectedToEnd}
        />
      )}
    </>
  );
}