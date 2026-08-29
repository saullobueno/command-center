import { useEffect, useRef } from 'react'
import { applyTicksToDevices, generateReplayTicks, type ReplayTick } from '@/lib/mock/replay'
import { useReplayStore } from '@/stores/replay-store'
import type { Device } from '@/types/device'

const PLAYBACK_INTERVAL_MS = 120

/**
 * Dono do loop de reprodução do Event Replay. Regenera a sequência de
 * ticks [0, rangeEnd] de forma determinística (ver src/lib/mock/replay.ts)
 * e, enquanto `isPlaying`, avança `currentIndex` a um ritmo fixo — bem
 * mais rápido que os 800ms/tick da simulação ao vivo, para a reprodução
 * não demorar minutos para mostrar uma janela de minutos.
 */
export function useEventReplay(
  initialDevices: Device[] | undefined,
  simulationStartedAt: string | null,
) {
  const active = useReplayStore((state) => state.active)
  const isPlaying = useReplayStore((state) => state.isPlaying)
  const rangeEnd = useReplayStore((state) => state.rangeEnd)
  const currentIndex = useReplayStore((state) => state.currentIndex)
  const setCurrentIndex = useReplayStore((state) => state.setCurrentIndex)
  const setReplayDevices = useReplayStore((state) => state.setReplayDevices)
  const pause = useReplayStore((state) => state.pause)

  const ticksRef = useRef<ReplayTick[]>([])

  useEffect(() => {
    if (!active || !initialDevices || !simulationStartedAt) return
    ticksRef.current = generateReplayTicks(initialDevices, rangeEnd, simulationStartedAt)
  }, [active, initialDevices, rangeEnd, simulationStartedAt])

  useEffect(() => {
    if (!active || !initialDevices) return
    const ticksUpToCurrent = ticksRef.current.slice(0, currentIndex)
    setReplayDevices(applyTicksToDevices(initialDevices, ticksUpToCurrent))
  }, [active, initialDevices, currentIndex, setReplayDevices])

  useEffect(() => {
    if (!active || !isPlaying) return

    const interval = setInterval(() => {
      const next = useReplayStore.getState().currentIndex + 1
      if (next > rangeEnd) {
        pause()
        return
      }
      setCurrentIndex(next)
    }, PLAYBACK_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [active, isPlaying, rangeEnd, pause, setCurrentIndex])
}
