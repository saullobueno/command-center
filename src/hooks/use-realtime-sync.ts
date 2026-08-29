import { useEffect, useRef } from 'react'
import { REALTIME_SEED, TICK_INTERVAL_MS } from '@/lib/mock/config'
import { simulateTick } from '@/lib/mock/realtime'
import { createRng } from '@/lib/random'
import { useDeviceStore } from '@/stores/device-store'
import type { Device } from '@/types/device'

/**
 * Hidrata o store de dispositivos a partir do resultado da query e, a
 * partir daí, simula "chegada de eventos em tempo real" via setInterval —
 * o equivalente, para este portfólio sem backend, a uma conexão
 * WebSocket. Ver docs/decisions/0007-simulacao-tempo-real.md.
 */
export function useRealtimeSync(devices: Device[] | undefined) {
  const hydrate = useDeviceStore((state) => state.hydrate)
  const applyUpdate = useDeviceStore((state) => state.applyUpdate)
  const hydratedRef = useRef(false)

  useEffect(() => {
    if (!devices || hydratedRef.current) return
    hydrate(devices)
    hydratedRef.current = true
  }, [devices, hydrate])

  useEffect(() => {
    if (!devices) return

    const rng = createRng(REALTIME_SEED)
    let counter = 0

    const interval = setInterval(() => {
      const currentDevices = Object.values(useDeviceStore.getState().devices)
      if (currentDevices.length === 0) return

      const { event, patch } = simulateTick(currentDevices, rng, `evt-${Date.now()}-${counter++}`)
      applyUpdate(event, patch)
    }, TICK_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [devices, applyUpdate])
}
