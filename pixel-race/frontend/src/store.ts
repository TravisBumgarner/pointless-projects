import { create } from 'zustand';
import { PointMap } from '../../shared';

interface EventState {
  queue: number;
  points: PointMap;
  clientId: string | null;
  alert: string | null;
  
  setQueue: (queue: number) => void;
  setPoints: (points: PointMap) => void;
  setClientId: (clientId: string | null) => void;
  setAlert: (alert: string | null) => void;
}

const useStore = create<EventState>((set) => ({
  queue: 0,
  points: {},
  clientId: null,
  alert: null,

  setQueue: (queue: number) => set({ queue }),
  setPoints: (points: PointMap) => set((state) => ({ 
    points: { ...state.points, ...points } 
  })),
  setClientId: (clientId: string | null) => set({ clientId }),
  setAlert: (alert: string | null) => set({ alert }),

}));

export default useStore;