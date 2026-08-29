import { History, Pause, Play, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { TICK_INTERVAL_MS } from '@/lib/mock/config'
import { useDeviceStore } from '@/stores/device-store'
import { useReplayStore } from '@/stores/replay-store'

const DEFAULT_WINDOW_TICKS = 100

function formatTickTime(simulationStartedAt: string | null, index: number): string {
  if (!simulationStartedAt) return '--:--:--'
  const time = new Date(new Date(simulationStartedAt).getTime() + index * TICK_INTERVAL_MS)
  return time.toLocaleTimeString('pt-BR')
}

export function EventReplayPanel() {
  const tickCount = useDeviceStore((state) => state.tickCount)
  const simulationStartedAt = useDeviceStore((state) => state.simulationStartedAt)

  const active = useReplayStore((state) => state.active)
  const isPlaying = useReplayStore((state) => state.isPlaying)
  const rangeStart = useReplayStore((state) => state.rangeStart)
  const rangeEnd = useReplayStore((state) => state.rangeEnd)
  const currentIndex = useReplayStore((state) => state.currentIndex)
  const activate = useReplayStore((state) => state.activate)
  const setRange = useReplayStore((state) => state.setRange)
  const setCurrentIndex = useReplayStore((state) => state.setCurrentIndex)
  const play = useReplayStore((state) => state.play)
  const pause = useReplayStore((state) => state.pause)
  const exit = useReplayStore((state) => state.exit)

  if (!active) {
    return (
      <div className="flex shrink-0 items-center border-b px-4 py-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={tickCount === 0}
          onClick={() => activate(Math.max(0, tickCount - DEFAULT_WINDOW_TICKS), tickCount)}
          className="gap-2"
        >
          <History className="size-4" />
          Event Replay
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-muted/30 flex shrink-0 flex-wrap items-center gap-3 border-b px-4 py-2">
      <span className="flex items-center gap-1.5 text-xs font-medium">
        <History className="size-4" />
        Event Replay
      </span>

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => (isPlaying ? pause() : play())}
        aria-label={isPlaying ? 'Pausar reprodução' : 'Reproduzir'}
      >
        {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
      </Button>

      <div className="flex flex-1 items-center gap-2">
        <span className="text-muted-foreground text-xs tabular-nums">
          {formatTickTime(simulationStartedAt, currentIndex)}
        </span>
        <Slider
          value={[currentIndex]}
          min={rangeStart}
          max={Math.max(rangeEnd, rangeStart + 1)}
          step={1}
          onValueChange={([value]) => value !== undefined && setCurrentIndex(value)}
          aria-label="Posição da reprodução"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-xs whitespace-nowrap">Janela:</span>
        <span className="text-muted-foreground text-xs tabular-nums">
          {formatTickTime(simulationStartedAt, rangeStart)}
        </span>
        <Slider
          value={[rangeStart, rangeEnd]}
          min={0}
          max={tickCount}
          step={1}
          onValueChange={([start, end]) =>
            start !== undefined && end !== undefined && setRange(start, end)
          }
          className="w-40"
          aria-label="Janela de tempo do replay"
        />
        <span className="text-muted-foreground text-xs tabular-nums">
          {formatTickTime(simulationStartedAt, rangeEnd)}
        </span>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={exit}
        aria-label="Sair do Event Replay"
      >
        <X className="size-4" />
      </Button>
    </div>
  )
}
