import { create } from 'zustand';
import { PointColor, PointMap } from '../../shared';
import { ErrorType } from './consts';

interface EventState {
  queue: number;
  points: PointMap;
  clientId: string | null;
  alerts: string[];
  placeInQueue: number | null;
  error: ErrorType | null;
  tempPoints: PointMap;
  selectedColorKey: PointColor;

  getAndRemoveNextAlert: () => string | null;

  setQueue: (queue: number) => void;
  setPoints: (points: PointMap) => void;
  setClientId: (clientId: string | null) => void;
  addAlert: (alert: string) => void;
  setPlaceInQueue: (placeInQueue: number | null) => void;
  moveUpInQueue: () => void;
  setError: (error: ErrorType) => void;
  setTempPoints: (tempPoints: PointMap) => void;
  setSelectedColorKey: (selectedColorKey: PointColor) => void;
}

const useStore = create<EventState>((set, get) => ({
  queue: 0,
  points: {},
  clientId: null,
  alerts: [],
  placeInQueue: null,
  error: null,
  tempPoints: {},
  selectedColorKey: "a",
  
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
  setClientId: (clientId) => set({ clientId }),
  addAlert: (alert) => set(state => ({alerts: [...state.alerts, alert]})),
  setPlaceInQueue: (placeInQueue) => set({ placeInQueue }),
  moveUpInQueue: () => set(state => ({ placeInQueue: state.placeInQueue ? state.placeInQueue - 1 : null })),
  setError: (error) => set({ error }),
  setTempPoints: (tempPoints) => set({ tempPoints }),
  setSelectedColorKey: (selectedColorKey) => set({ selectedColorKey }),
}));

export default useStore;