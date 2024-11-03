import { useState } from 'react';
import { Clock, Wrench, AlertTriangle, Timer, Loader2 } from 'lucide-react';
import { MaintenanceRecord } from './types/maintenance';
import { useMaintenanceContext } from './context/MaintenanceContext';
import { MetricsCard } from './components/MetricsCard';
import { Timeline } from './components/Timeline';
import { MaintenanceFormModal } from './components/MaintenanceFormModal';
import { RecordModal } from './components/RecordModal';
import { EndCallModal } from './components/EndCallModal';
import { ColorPicker } from './components/ColorPicker';

function calculateMTTR(records: MaintenanceRecord[]): string {
  const completedRecords = records.filter(r => r.endTime != null);
  if (completedRecords.length === 0) return '0m';
  
  const totalMinutes = completedRecords.reduce((acc, record) => {
    const start = new Date(record.startTime);
    const end = new Date(record.endTime!);
    return acc + (end.getTime() - start.getTime()) / (1000 * 60);
  }, 0);
  
  return `${Math.round(totalMinutes / completedRecords.length)}m`;
}

function App() {
  const { state } = useMaintenanceContext();
  const [showNewRecordModal, setShowNewRecordModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [recordToEnd, setRecordToEnd] = useState<MaintenanceRecord | null>(null);
  const currentShift = new Date().getHours() >= 5 && new Date().getHours() < 17 ? 'day' : 'night';

  const activeRecords = state.records.filter(r => !r.endTime);
  const mttr = calculateMTTR(state.records);
  const downtimeIncidents = state.records.filter(r => r.causedDowntime).length;

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <p className="text-slate-400">Loading maintenance records...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 max-w-md mx-4">
          <h2 className="text-red-400 text-lg font-semibold mb-2">Error Loading Records</h2>
          <p className="text-slate-300">{state.error}</p>
          <p className="text-slate-400 text-sm mt-4">Please refresh the page to try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="sticky top-0 z-30 bg-gradient-to-b from-slate-900 to-slate-900/95 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Maintenance Time Logger</h1>
              <p className="text-slate-400 text-sm md:text-base">Track and manage maintenance activities</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewRecordModal(true)}
                className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Clock className="h-5 w-5" />
                <span>Start Call</span>
              </button>
              <button
                onClick={() => {
                  const activeRecord = activeRecords[0];
                  if (activeRecord) setRecordToEnd(activeRecord);
                }}
                className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                disabled={activeRecords.length === 0}
              >
                <Timer className="h-5 w-5" />
                <span>End Call</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            <MetricsCard
              title="Active Calls"
              value={activeRecords.length}
              icon={<Clock className="h-5 w-5 md:h-6 md:w-6" />}
              valueSize="large"
            />
            <MetricsCard
              title="Total Today"
              value={state.records.length}
              icon={<Wrench className="h-5 w-5 md:h-6 md:w-6" />}
              trend={2}
              trendIsGood={false}
            />
            <MetricsCard
              title="Downtime"
              value={downtimeIncidents}
              icon={<AlertTriangle className="h-5 w-5 md:h-6 md:w-6" />}
              trend={15}
              trendIsGood={false}
            />
            <MetricsCard
              title="Avg. Repair"
              value={mttr}
              icon={<Timer className="h-5 w-5 md:h-6 md:w-6" />}
              trend={8}
              trendIsGood={false}
            />
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Today's Timeline</h2>
          <Timeline
            records={state.records}
            shift={currentShift}
            onRecordClick={setSelectedRecord}
          />
        </div>
      </div>

      {showNewRecordModal && (
        <MaintenanceFormModal onClose={() => setShowNewRecordModal(false)} />
      )}

      {selectedRecord && (
        <RecordModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}

      {recordToEnd && (
        <EndCallModal
          record={recordToEnd}
          onClose={() => setRecordToEnd(null)}
        />
      )}

      <ColorPicker />
    </div>
  );
}

export default App;