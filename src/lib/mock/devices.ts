import { createRng, pick, range } from '@/lib/random'
import type { Device, DeviceStatus, DeviceType } from '@/types/device'
import { SITES } from './sites'

const DEVICE_TYPES: DeviceType[] = ['sensor', 'vehicle', 'meter', 'gateway']

// Distribuição de status realista: a maioria online, uma fatia pequena em
// alerta e uma fatia menor ainda offline.
const STATUS_WEIGHTS: readonly [DeviceStatus, number][] = [
  ['online', 0.85],
  ['warning', 0.1],
  ['offline', 0.05],
]

function weightedStatus(rng: () => number): DeviceStatus {
  const roll = rng()
  let acc = 0
  for (const [status, weight] of STATUS_WEIGHTS) {
    acc += weight
    if (roll <= acc) return status
  }
  return 'online'
}

const SITE_SPREAD_DEGREES = 0.35

export function generateDevices(count: number, seed = 1, now = new Date()): Device[] {
  const rng = createRng(seed)
  const lastSeen = now.toISOString()

  return Array.from({ length: count }, (_, index) => {
    const site = pick(rng, SITES)
    const type = pick(rng, DEVICE_TYPES)
    const status = weightedStatus(rng)

    return {
      id: `dev-${index.toString(36)}`,
      name: `${type}-${site.id.replace('site-', '')}-${index}`,
      type,
      status,
      siteId: site.id,
      lat: site.lat + range(rng, -SITE_SPREAD_DEGREES, SITE_SPREAD_DEGREES),
      lng: site.lng + range(rng, -SITE_SPREAD_DEGREES, SITE_SPREAD_DEGREES),
      battery: status === 'offline' ? range(rng, 0, 15) : range(rng, 20, 100),
      signal: status === 'offline' ? 0 : range(rng, 30, 100),
      lastSeen,
    } satisfies Device
  })
}
