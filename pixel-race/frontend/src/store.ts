import { create } from 'zustand';
import { PointMap } from '../../shared';

interface EventState {
  queue: number;
  points: PointMap;
  clientId: string | null;
  alerts: string[];
  placeInQueue: number | null;

  getAndRemoveNextAlert: () => string | null;

  setQueue: (queue: number) => void;
  setPoints: (points: PointMap) => void;
  setClientId: (clientId: string | null) => void;
  addAlert: (alert: string) => void;
  setPlaceInQueue: (placeInQueue: number | null) => void;
}

const useStore = create<EventState>((set, get) => ({
  queue: 0,
  points: {},
  clientId: null,
  alerts: [],
  placeInQueue: null,

  getAndRemoveNextAlert: () => {
    const alerts = get().alerts;
    if (alerts.length === 0) return null;
    
    const nextAlert = alerts[0];
    set({ alerts: alerts.slice(1) });
    return nextAlert;
  },
  
  setQueue: (queue: number) => set({ queue }),
  setPoints: (points: PointMap) => set((state) => ({ 
    points: { ...state.points, ...points } 
  })),
  setClientId: (clientId: string | null) => set({ clientId }),
  addAlert: (alert: string) => set(state => ({alerts: [...state.alerts, alert]})),
  setPlaceInQueue: (placeInQueue: number | null) => set({ placeInQueue }),
}));

export default useStore;