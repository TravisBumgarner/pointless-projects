import { create } from 'zustand';
import { PointEncoded } from '../../shared';
import { PointXY } from './types';
import { decodePoints } from './utilities';

interface EventState {
  queue: number;
  points: PointXY[];
  clientId: string | null;
  
  setQueue: (queue: number) => void;
  setPoints: (points: PointEncoded[]) => void;
  setClientId: (clientId: string | null) => void;
}

const useStore = create<EventState>((set) => ({
  queue: 0,
  points: [],
  clientId: null,

  setQueue: (queue: number) => set({ queue }),
  setPoints: (points: PointEncoded[]) => {
    const pointsXY = decodePoints(points);
    set({ points: pointsXY});
  },
  setClientId: (clientId: string | null) => set({ clientId }),
}));

export default useStore;