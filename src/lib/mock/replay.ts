import { REALTIME_SEED, TICK_INTERVAL_MS } from '@/lib/mock/config'
import { simulateTick } from '@/lib/mock/realtime'
import { createRng } from '@/lib/random'
import type { Device } from '@/types/device'
import type { DeviceEvent } from '@/types/event'

export interface ReplayTick {
  index: number
  event: DeviceEvent
  patch: Partial<Device>
}

/**
 * Reconstrói, do zero e de forma determinística, a sequência de ticks que
 * já aconteceu ao vivo — usa o mesmo seed e o mesmo `initialDevices` (a
 * resposta original de /api/devices, nunca mutada) que
 * `useRealtimeSync` usou. Não depende de nenhum histórico armazenado: é
 * só re-rodar a mesma simulação. Ver docs/decisions/0007 e 0012.
 */
export function generateReplayTicks(
  initialDevices: readonly Device[],
  tickCount: number,
  simulationStartedAt: string,
): ReplayTick[] {
  const rng = createRng(REALTIME_SEED)
  const working = initialDevices.map((device) => ({ ...device }))
  const startTime = new Date(simulationStartedAt).getTime()
  const ticks: ReplayTick[] = []

  for (let index = 0; index < tickCount; index++) {
    const tickTime = new Date(startTime + index * TICK_INTERVAL_MS)
    const { event, patch } = simulateTick(working, rng, `replay-${index}`, tickTime)

    const device = working.find((d) => d.id === event.deviceId)
    if (device) Object.assign(device, patch)

    ticks.push({ index, event, patch })
  }

  return ticks
}

/** Aplica uma sequência de ticks (já gerada) sobre uma cópia dos
 * dispositivos originais, produzindo o snapshot de estado naquele ponto. */
export function applyTicksToDevices(
  initialDevices: readonly Device[],
  ticks: readonly ReplayTick[],
): Record<string, Device> {
  const devices = new Map(initialDevices.map((device) => [device.id, { ...device }]))

  for (const tick of ticks) {
    const device = devices.get(tick.event.deviceId)
    if (device) Object.assign(device, tick.patch)
  }

  return Object.fromEntries(devices)
}
