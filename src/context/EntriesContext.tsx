import { createContext, useContext, useEffect, useReducer, useRef, type ReactNode } from 'react';

interface BaseEntry {
  id: string;
  date: string;
  odometer: number;
}

interface FuelEntry extends BaseEntry {
  type: 'fuel';
  liters: number;
  costPerLiter: number;
  cost: number;
}

interface ServiceEntry extends BaseEntry {
  type: 'service';
  serviceType: string;
  description?: string;
  cost: number;
  nextServiceDue?: number;
}

export type Entry = FuelEntry | ServiceEntry;

type EntryAction =
  | { type: 'ADD_ENTRY'; payload: Entry }
  | { type: 'DELETE_ENTRY'; payload: { id: string } }
  | { type: 'EDIT_ENTRY'; payload: Entry }
  | { type: 'LOAD_ENTRIES'; payload: Entry[] };

function entriesReducer(state: Entry[], action: EntryAction): Entry[] {
  switch (action.type) {
    case 'ADD_ENTRY':
      return [...state, action.payload];
    case 'DELETE_ENTRY':
      return state.filter(entry => entry.id !== action.payload.id);
    case 'EDIT_ENTRY':
      return state.map(entry =>
        entry.id === action.payload.id ? action.payload : entry
      );
    case 'LOAD_ENTRIES':
      return action.payload;
    default:
      return state;
  }
}

interface EntriesContextType {
  entries: Entry[];
  dispatch: React.Dispatch<EntryAction>;
}

const STORAGE_KEY = 'moto-tracker-entries';
const EntriesContext = createContext<EntriesContextType | undefined>(undefined);

export function EntriesProvider({ children }: { children: ReactNode }) {
  const [entries, dispatch] = useReducer(entriesReducer, []);
  const isFirstRender = useRef(true)
  useEffect(()=>{
    const saved= localStorage.getItem(STORAGE_KEY);
    if (saved){
    try {
      const parsedEntries: Entry[] = JSON.parse(saved);
      dispatch({ type: 'LOAD_ENTRIES', payload: parsedEntries });
    } catch (error) {
      console.error('Failed to parse saved entries:', error);
    }
  }
}, []);
  useEffect(()=>{
    if(isFirstRender.current){
      isFirstRender.current=false
      return;
    }
    localStorage.setItem(STORAGE_KEY,JSON.stringify(entries))
  },[entries])
  return (
    <EntriesContext.Provider value={{ entries, dispatch }}>
      {children}
    </EntriesContext.Provider>
  );
}

export function useEntries() {
  const context = useContext(EntriesContext);
  if (!context) {
    throw new Error('useEntries must be used within EntriesProvider');
  }
  return context;
}