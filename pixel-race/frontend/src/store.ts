import { create } from 'zustand';
import { Event } from './types';

interface EventState {
  eventData: Event | null;
  setEventData: (data: Event | null) => void;
}

const useEventStore = create<EventState>((set) => ({
  eventData: null,
  setEventData: (data: Event | null) => set({ eventData: data }),
}));

export default useEventStore;