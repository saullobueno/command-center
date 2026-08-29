import { create } from 'zustand'
import type { Device } from '@/types/device'

interface ReplayStoreState {
  active: boolean
  isPlaying: boolean
  rangeStart: number
  rangeEnd: number
  currentIndex: number
  replayDevices: Record<string, Device> | null
  activate: (rangeStart: number, rangeEnd: number) => void
  setRange: (rangeStart: number, rangeEnd: number) => void
  setCurrentIndex: (index: number) => void
  setReplayDevices: (devices: Record<string, Device>) => void
  play: () => void
  pause: () => void
  exit: () => void
}

export const useReplayStore = create<ReplayStoreState>((set) => ({
  active: false,
  isPlaying: false,
  rangeStart: 0,
  rangeEnd: 0,
  currentIndex: 0,
  replayDevices: null,

  activate: (rangeStart, rangeEnd) =>
    set({ active: true, isPlaying: false, rangeStart, rangeEnd, currentIndex: rangeStart }),

  setRange: (rangeStart, rangeEnd) =>
    set((state) => ({
      rangeStart,
      rangeEnd,
      currentIndex: Math.min(Math.max(state.currentIndex, rangeStart), rangeEnd),
    })),

  setCurrentIndex: (index) => set({ currentIndex: index }),
  setReplayDevices: (devices) => set({ replayDevices: devices }),

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),

  exit: () =>
    set({ active: false, isPlaying: false, replayDevices: null, rangeStart: 0, rangeEnd: 0 }),
}))
