import { create } from 'zustand';
import { PointEncoded, SSEMessage } from '../../shared';
import { PointXY } from './types';
import { decodePoints } from './utilities';

interface EventState {
  eventData: SSEMessage | null;
  setEventData: (data: SSEMessage | null) => void;
  queue: number;
  setQueue: (queue: number) => void;
  points: PointXY[];
  setPoints: (points: PointEncoded[]) => void;
  clientId: string | null;
  setClientId: (clientId: string | null) => void;
}

const useStore = create<EventState>((set) => ({
  eventData: null,
  setEventData: (data: SSEMessage | null) => set({ eventData: data }),
  queue: 0,
  setQueue: (queue: number) => set({ queue }),
  points: [],
  setPoints: (points: PointEncoded[]) => {
    const pointsXY = decodePoints(points);
    set({ points: pointsXY});
  },
  clientId: null,
  setClientId: (clientId: string | null) => set({ clientId }),
}));

export default useStore;