import { create } from 'zustand'
import type { DeviceStatus, DeviceType } from '@/types/device'

export interface DeviceFilters {
  search: string
  statuses: Set<DeviceStatus>
  types: Set<DeviceType>
  siteId: string | null
}

interface UiStoreState {
  filters: DeviceFilters
  selectedDeviceId: string | null
  commandPaletteOpen: boolean
  setSearch: (search: string) => void
  toggleStatus: (status: DeviceStatus) => void
  toggleType: (type: DeviceType) => void
  setSiteId: (siteId: string | null) => void
  resetFilters: () => void
  selectDevice: (id: string | null) => void
  setCommandPaletteOpen: (open: boolean) => void
}

const emptyFilters: DeviceFilters = {
  search: '',
  statuses: new Set(),
  types: new Set(),
  siteId: null,
}

function toggleInSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  return next
}

export const useUiStore = create<UiStoreState>((set) => ({
  filters: emptyFilters,
  selectedDeviceId: null,
  commandPaletteOpen: false,

  setSearch: (search) => set((state) => ({ filters: { ...state.filters, search } })),

  toggleStatus: (status) =>
    set((state) => ({
      filters: { ...state.filters, statuses: toggleInSet(state.filters.statuses, status) },
    })),

  toggleType: (type) =>
    set((state) => ({
      filters: { ...state.filters, types: toggleInSet(state.filters.types, type) },
    })),

  setSiteId: (siteId) => set((state) => ({ filters: { ...state.filters, siteId } })),

  resetFilters: () => set({ filters: emptyFilters }),

  selectDevice: (id) => set({ selectedDeviceId: id }),

  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}))
