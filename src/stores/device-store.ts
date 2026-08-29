import { create } from 'zustand'
import type { Device, DeviceStatus } from '@/types/device'
import type { DeviceEvent } from '@/types/event'

const MAX_EVENTS = 300
const MAX_HISTORY = 200

export interface StatusSnapshot {
  timestamp: string
  online: number
  warning: number
  offline: number
}

function countByStatus(devices: Record<string, Device>): Omit<StatusSnapshot, 'timestamp'> {
  const counts: Record<DeviceStatus, number> = { online: 0, warning: 0, offline: 0 }
  for (const device of Object.values(devices)) counts[device.status]++
  return counts
}

interface DeviceStoreState {
  devices: Record<string, Device>
  events: DeviceEvent[]
  /** Quantos ticks da simulação já ocorreram — usado pelo Event Replay
   * para saber até onde é possível "rebobinar" de forma determinística. */
  tickCount: number
  /** Timestamp do primeiro tick — âncora para converter índice de tick em
   * horário real na UI do Event Replay. */
  simulationStartedAt: string | null
  /** Série temporal de contagens por status, um ponto por tick (até
   * MAX_HISTORY pontos) — alimenta o gráfico de status ao vivo. */
  statusHistory: StatusSnapshot[]
  hydrate: (devices: Device[]) => void
  applyUpdate: (event: DeviceEvent, patch: Partial<Device>) => void
  /** Anotação manual de um operador (via formulário) — só empilha o
   * evento, não mexe em `devices`/`tickCount`/`statusHistory`: não faz
   * parte da simulação determinística, então não pode interferir no
   * Event Replay (ver docs/decisions/0007). */
  addManualEvent: (event: DeviceEvent) => void
}

export const useDeviceStore = create<DeviceStoreState>((set) => ({
  devices: {},
  events: [],
  tickCount: 0,
  simulationStartedAt: null,
  statusHistory: [],

  hydrate: (devices) =>
    set({
      devices: Object.fromEntries(devices.map((device) => [device.id, device])),
      events: [],
      tickCount: 0,
      simulationStartedAt: null,
      statusHistory: [],
    }),

  applyUpdate: (event, patch) =>
    set((state) => {
      const current = state.devices[event.deviceId]
      if (!current) return state

      const devices = {
        ...state.devices,
        [event.deviceId]: { ...current, ...patch },
      }
      const snapshot: StatusSnapshot = { timestamp: event.timestamp, ...countByStatus(devices) }

      return {
        devices,
        events: [event, ...state.events].slice(0, MAX_EVENTS),
        tickCount: state.tickCount + 1,
        simulationStartedAt: state.simulationStartedAt ?? event.timestamp,
        statusHistory: [...state.statusHistory, snapshot].slice(-MAX_HISTORY),
      }
    }),

  addManualEvent: (event) =>
    set((state) => ({ events: [event, ...state.events].slice(0, MAX_EVENTS) })),
}))
