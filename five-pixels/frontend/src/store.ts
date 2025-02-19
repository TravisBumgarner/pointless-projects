import { create } from "zustand";
import { ErrorType, PAINTING_TIME_MS } from "../../shared";
import { PointColor, PointMap } from "../../shared/types";

interface EventState {
  queue: number;
  points: PointMap;
  clientId: string | null;
  alerts: string[];
  placeInQueue: number | null;
  error: ErrorType | null;
  tempPoints: PointMap;
  timeRemaining: number;
  selectedColorKey: PointColor;
  showWelcomeModal: boolean;
  canPaint: boolean;

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
  resetTimeRemaining: () => void;
  tickTimeRemaining: () => void;
  setShowWelcomeModal: (showWelcomeModal: boolean) => void;
  setCanPaint: (canPaint: boolean) => void;
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
  canPaint: false,
  timeRemaining: PAINTING_TIME_MS / 1000,
  showWelcomeModal: false,
  getAndRemoveNextAlert: () => {
    const alerts = get().alerts;
    if (alerts.length === 0) return null;

    const nextAlert = alerts[0];
    set({ alerts: alerts.slice(1) });
    return nextAlert;
  },

  setQueue: (queue: number) => set({ queue }),
  setPoints: (points: PointMap) =>
    set((state) => ({
      points: { ...state.points, ...points },
    })),
  setClientId: (clientId) => set({ clientId }),
  addAlert: (alert) => set((state) => ({ alerts: [...state.alerts, alert] })),
  setPlaceInQueue: (placeInQueue) =>
    set(() => {
      return { placeInQueue };
    }),
  moveUpInQueue: () =>
    set((state) => ({
      placeInQueue: state.placeInQueue ? state.placeInQueue - 1 : null,
    })),
  setError: (error) => set({ error }),
  setTempPoints: (tempPoints) => set({ tempPoints }),
  setSelectedColorKey: (selectedColorKey) => set({ selectedColorKey }),
  resetTimeRemaining: () => set({ timeRemaining: PAINTING_TIME_MS / 1000 }),
  tickTimeRemaining: () =>
    set((state) => ({ timeRemaining: state.timeRemaining - 1 })),
  setShowWelcomeModal: (showWelcomeModal) => set({ showWelcomeModal }),
  setCanPaint: (canPaint) => set({ canPaint }),
}));

export default useStore;
