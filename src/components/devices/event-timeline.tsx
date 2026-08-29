import { ScrollArea } from '@/components/ui/scroll-area'
import { formatLastSeen } from '@/lib/device-format'
import { cn } from '@/lib/utils'
import { useDeviceStore } from '@/stores/device-store'
import type { EventSeverity } from '@/types/event'

const SEVERITY_DOT: Record<EventSeverity, string> = {
  info: 'bg-sky-500',
  warning: 'bg-amber-500',
  critical: 'bg-red-500',
}

export function EventTimeline() {
  const events = useDeviceStore((state) => state.events)

  if (events.length === 0) {
    return <p className="text-muted-foreground p-4 text-sm">Nenhum evento ainda.</p>
  }

  return (
    <ScrollArea className="h-full">
      <ul className="flex flex-col gap-3 p-3">
        {events.map((event) => (
          <li key={event.id} className="flex items-start gap-2 text-sm">
            <span
              className={cn('mt-1.5 size-1.5 shrink-0 rounded-full', SEVERITY_DOT[event.severity])}
              aria-hidden="true"
            />
            <div className="flex min-w-0 flex-col">
              <span className="truncate">{event.message}</span>
              <span className="text-muted-foreground text-xs">
                {formatLastSeen(event.timestamp)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}
