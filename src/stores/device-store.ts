import { create } from 'zustand'
import type { Device } from '@/types/device'
import type { DeviceEvent } from '@/types/event'

const MAX_EVENTS = 300

interface DeviceStoreState {
  devices: Record<string, Device>
  events: DeviceEvent[]
  hydrate: (devices: Device[]) => void
  applyUpdate: (event: DeviceEvent, patch: Partial<Device>) => void
}

export const useDeviceStore = create<DeviceStoreState>((set) => ({
  devices: {},
  events: [],

  hydrate: (devices) =>
    set({
      devices: Object.fromEntries(devices.map((device) => [device.id, device])),
      events: [],
    }),

  applyUpdate: (event, patch) =>
    set((state) => {
      const current = state.devices[event.deviceId]
      if (!current) return state

      return {
        devices: {
          ...state.devices,
          [event.deviceId]: { ...current, ...patch },
        },
        events: [event, ...state.events].slice(0, MAX_EVENTS),
      }
    }),
}))
