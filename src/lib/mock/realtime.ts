import { pick, range } from '@/lib/random'
import type { Device, DeviceStatus } from '@/types/device'
import type { DeviceEvent, EventSeverity } from '@/types/event'

export interface RealtimeTick {
  event: DeviceEvent
  patch: Partial<Device>
}

const STATUS_TRANSITIONS: Record<DeviceStatus, DeviceStatus[]> = {
  online: ['warning'],
  warning: ['online', 'offline'],
  offline: ['online'],
}

function severityFor(status: DeviceStatus): EventSeverity {
  if (status === 'offline') return 'critical'
  if (status === 'warning') return 'warning'
  return 'info'
}

function messageFor(device: Device, status: DeviceStatus): string {
  switch (status) {
    case 'offline':
      return `${device.name} parou de responder`
    case 'warning':
      return `${device.name} com sinal instável`
    case 'online':
      return `${device.name} voltou a operar normalmente`
  }
}

/**
 * Um "tick" da simulação: escolhe um dispositivo, decide sua próxima
 * transição de status e produz o evento + patch correspondentes. É uma
 * função pura (toda aleatoriedade vem do `rng` injetado) para que a mesma
 * sequência de ticks seja reproduzível — a base do Event Replay.
 */
export function simulateTick(
  devices: readonly Device[],
  rng: () => number,
  eventId: string,
  now = new Date(),
): RealtimeTick {
  const device = pick(rng, devices)
  const transitions = STATUS_TRANSITIONS[device.status]
  const nextStatus = transitions.length > 0 ? pick(rng, transitions) : device.status

  const patch: Partial<Device> = {
    status: nextStatus,
    battery: nextStatus === 'offline' ? range(rng, 0, 15) : range(rng, 20, 100),
    signal: nextStatus === 'offline' ? 0 : range(rng, 30, 100),
    lastSeen: now.toISOString(),
  }

  const event: DeviceEvent = {
    id: eventId,
    deviceId: device.id,
    type: 'status-change',
    severity: severityFor(nextStatus),
    message: messageFor(device, nextStatus),
    timestamp: now.toISOString(),
  }

  return { event, patch }
}
