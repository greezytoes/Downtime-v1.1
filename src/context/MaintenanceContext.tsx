import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { MaintenanceRecord } from '../types/maintenance';
import { supabase, fetchMaintenanceRecords } from '../lib/supabase';

interface MaintenanceState {
  records: MaintenanceRecord[];
  loading: boolean;
  error: string | null;
}

type MaintenanceAction =
  | { type: 'SET_RECORDS'; payload: MaintenanceRecord[] }
  | { type: 'ADD_RECORD'; payload: MaintenanceRecord }
  | { type: 'UPDATE_RECORD'; payload: MaintenanceRecord }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: MaintenanceState = {
  records: [],
  loading: true,
  error: null
};

const MaintenanceContext = createContext<{
  state: MaintenanceState;
  dispatch: React.Dispatch<MaintenanceAction>;
} | undefined>(undefined);

function maintenanceReducer(state: MaintenanceState, action: MaintenanceAction): MaintenanceState {
  switch (action.type) {
    case 'SET_RECORDS':
      return {
        ...state,
        records: action.payload,
        loading: false,
        error: null
      };
    case 'ADD_RECORD':
      return {
        ...state,
        records: [...state.records, action.payload],
        error: null
      };
    case 'UPDATE_RECORD':
      return {
        ...state,
        records: state.records.map(record =>
          record.id === action.payload.id ? action.payload : record
        ),
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
}

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(maintenanceReducer, initialState);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const records = await fetchMaintenanceRecords();
        dispatch({ type: 'SET_RECORDS', payload: records });
      } catch (error) {
        console.error('Error loading records:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load maintenance records. Please try again.' });
      }
    };

    loadRecords();

    const channel = supabase
      .channel('maintenance_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_records'
        },
        async () => {
          try {
            const records = await fetchMaintenanceRecords();
            dispatch({ type: 'SET_RECORDS', payload: records });
          } catch (error) {
            console.error('Error reloading records:', error);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <MaintenanceContext.Provider value={{ state, dispatch }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenanceContext() {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenanceContext must be used within a MaintenanceProvider');
  }
  return context;
}