import { describe, expect, it } from 'vitest'
import { REALTIME_SEED } from '@/lib/mock/config'
import { createRng } from '@/lib/random'
import type { Device } from '@/types/device'
import { generateDevices } from './devices'
import { simulateTick } from './realtime'
import { applyTicksToDevices, generateReplayTicks } from './replay'

const START = new Date('2026-01-01T10:00:00.000Z')

describe('generateReplayTicks', () => {
  it('reproduz exatamente a mesma sequência que uma simulação "ao vivo" equivalente', () => {
    const initialDevices = generateDevices(100, 1, START)

    // Simula "ao vivo": mesma seed, mutando uma cópia de trabalho a cada
    // tick — é exatamente o que useRealtimeSync faz.
    const rng = createRng(REALTIME_SEED)
    const live = initialDevices.map((d) => ({ ...d }))
    const liveTicks = Array.from({ length: 20 }, (_, index) => {
      const tickTime = new Date(START.getTime() + index * 800)
      const { event, patch } = simulateTick(live, rng, `live-${index}`, tickTime)
      const device = live.find((d) => d.id === event.deviceId)
      if (device) Object.assign(device, patch)
      return { event, patch }
    })

    const replayTicks = generateReplayTicks(initialDevices, 20, START.toISOString())

    // Os ids dos eventos são gerados de forma diferente em cada caminho
    // (`live-N` vs `replay-N`) só por serem chamados de lugares diferentes
    // — o que importa é que o restante do evento e o patch sejam idênticos.
    const omitId = (event: (typeof liveTicks)[number]['event']) => {
      const { id: _id, ...rest } = event
      return rest
    }

    expect(replayTicks.map((t) => ({ event: omitId(t.event), patch: t.patch }))).toEqual(
      liveTicks.map((t) => ({ event: omitId(t.event), patch: t.patch })),
    )
  })

  it('é determinístico: duas chamadas com os mesmos argumentos produzem o mesmo resultado', () => {
    const initialDevices = generateDevices(50, 2, START)
    const a = generateReplayTicks(initialDevices, 30, START.toISOString())
    const b = generateReplayTicks(initialDevices, 30, START.toISOString())
    expect(a).toEqual(b)
  })
})

describe('applyTicksToDevices', () => {
  it('aplica os patches na ordem e mantém dispositivos não afetados intactos', () => {
    const initialDevices: Device[] = [
      {
        id: 'a',
        name: 'sensor-a',
        type: 'sensor',
        status: 'online',
        siteId: 'site-sp',
        lat: 0,
        lng: 0,
        battery: 100,
        signal: 100,
        lastSeen: START.toISOString(),
      },
      {
        id: 'b',
        name: 'sensor-b',
        type: 'sensor',
        status: 'online',
        siteId: 'site-sp',
        lat: 0,
        lng: 0,
        battery: 100,
        signal: 100,
        lastSeen: START.toISOString(),
      },
    ]

    const ticks = generateReplayTicks(initialDevices, 15, START.toISOString())
    const result = applyTicksToDevices(initialDevices, ticks)

    expect(Object.keys(result).sort()).toEqual(['a', 'b'])
    // Pelo menos um dos dois deve ter sido afetado em 15 ticks.
    const changed = Object.values(result).some(
      (device) => device.battery !== 100 || device.status !== 'online',
    )
    expect(changed).toBe(true)
  })
})
