import { CommandPalette } from '@/components/command-palette'
import { ErrorBoundary } from '@/components/error-boundary'
import { DeviceDetailPanel } from '@/components/devices/device-detail-panel'
import { DeviceFilters } from '@/components/devices/device-filters'
import { DeviceMap } from '@/components/devices/device-map'
import { DeviceStats } from '@/components/devices/device-stats'
import { DeviceTable } from '@/components/devices/device-table'
import { EventTimeline } from '@/components/devices/event-timeline'
import { Skeleton } from '@/components/ui/skeleton'
import { useDevicesQuery } from '@/hooks/use-devices-query'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { filterDevices } from '@/lib/filter-devices'
import { useDeviceStore } from '@/stores/device-store'
import { useUiStore } from '@/stores/ui-store'

function App() {
  const { data: initialDevices, isLoading, isError } = useDevicesQuery()
  useRealtimeSync(initialDevices)

  const liveDevices = useDeviceStore((state) => state.devices)
  const filters = useUiStore((state) => state.filters)
  const selectedDeviceId = useUiStore((state) => state.selectedDeviceId)
  const selectDevice = useUiStore((state) => state.selectDevice)
  const setCommandPaletteOpen = useUiStore((state) => state.setCommandPaletteOpen)

  const devices = Object.values(liveDevices)
  const filteredDevices = filterDevices(devices, filters)
  const selectedDevice = selectedDeviceId ? (liveDevices[selectedDeviceId] ?? null) : null

  if (isError) {
    return (
      <main className="flex min-h-svh items-center justify-center p-6 text-center">
        <p className="text-destructive text-sm">
          Não foi possível carregar os dispositivos. Tente recarregar a página.
        </p>
      </main>
    )
  }

  if (isLoading || devices.length === 0) {
    return (
      <main className="flex min-h-svh flex-col gap-4 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[60vh] w-full" />
      </main>
    )
  }

  return (
    <div className="flex h-svh flex-col">
      <header className="flex shrink-0 items-center justify-between border-b px-4 py-3">
        <div>
          <h1 className="text-lg font-semibold">Command Center</h1>
          <p className="text-muted-foreground text-xs">
            Centro de operações — dispositivos IoT em tempo real (simulado)
          </p>
        </div>
        <div className="flex items-center gap-4">
          <DeviceStats />
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="text-muted-foreground hover:bg-muted flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs"
          >
            Buscar dispositivo
            <kbd className="bg-muted rounded border px-1.5 py-0.5 text-[10px]">Ctrl K</kbd>
          </button>
        </div>
      </header>

      <DeviceFilters />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1">
            <ErrorBoundary
              fallback={
                <div className="text-muted-foreground flex h-full items-center justify-center p-6 text-center text-sm">
                  Não foi possível carregar o mapa (WebGL indisponível neste ambiente). A tabela
                  abaixo continua funcionando normalmente.
                </div>
              }
            >
              <DeviceMap
                devices={filteredDevices}
                selectedDeviceId={selectedDeviceId}
                onSelectDevice={selectDevice}
              />
            </ErrorBoundary>
          </div>
          <div className="h-72 shrink-0 border-t p-2">
            <DeviceTable
              devices={filteredDevices}
              selectedDeviceId={selectedDeviceId}
              onSelectDevice={selectDevice}
            />
          </div>
        </div>

        <aside className="flex w-80 shrink-0 flex-col overflow-hidden border-l">
          <DeviceDetailPanel device={selectedDevice} />
          <div className="min-h-0 flex-1 border-t">
            <EventTimeline />
          </div>
        </aside>
      </div>

      <CommandPalette />
    </div>
  )
}

export default App
