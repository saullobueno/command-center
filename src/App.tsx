import { lazy, Suspense } from 'react'
import { CommandPalette } from '@/components/command-palette'
import { DashboardLayoutToggle } from '@/components/dashboard-layout-toggle'
import { ErrorBoundary } from '@/components/error-boundary'
import { EventReplayPanel } from '@/components/event-replay-panel'
import { DeviceDetailPanel } from '@/components/devices/device-detail-panel'
import { DeviceFilters } from '@/components/devices/device-filters'
import { DeviceStats } from '@/components/devices/device-stats'
import { DeviceTable } from '@/components/devices/device-table'
import { EventTimeline } from '@/components/devices/event-timeline'
import { OfflineBanner } from '@/components/offline-banner'
import { ThemeToggle } from '@/components/theme-toggle'
import { Skeleton } from '@/components/ui/skeleton'
import { useDevicesQuery } from '@/hooks/use-devices-query'
import { useEventReplay } from '@/hooks/use-event-replay'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { useThemeSync } from '@/hooks/use-theme-sync'
import { filterDevices } from '@/lib/filter-devices'
import { useDashboardStore } from '@/stores/dashboard-store'
import { useDeviceStore } from '@/stores/device-store'
import { useReplayStore } from '@/stores/replay-store'
import { useUiStore } from '@/stores/ui-store'

// Mapa (maplibre-gl) e gráfico (echarts) são as duas dependências mais
// pesadas do bundle — carregados sob demanda em vez de no chunk inicial.
const DeviceMap = lazy(() =>
  import('@/components/devices/device-map').then((m) => ({ default: m.DeviceMap })),
)
const StatusHistoryChart = lazy(() =>
  import('@/components/devices/status-history-chart').then((m) => ({
    default: m.StatusHistoryChart,
  })),
)

function App() {
  const theme = useThemeSync()
  const { data: initialDevices, isLoading, isError } = useDevicesQuery()
  useRealtimeSync(initialDevices)

  const liveDevices = useDeviceStore((state) => state.devices)
  const simulationStartedAt = useDeviceStore((state) => state.simulationStartedAt)
  const statusHistory = useDeviceStore((state) => state.statusHistory)
  const filters = useUiStore((state) => state.filters)
  const selectedDeviceId = useUiStore((state) => state.selectedDeviceId)
  const selectDevice = useUiStore((state) => state.selectDevice)
  const setCommandPaletteOpen = useUiStore((state) => state.setCommandPaletteOpen)
  const visiblePanels = useDashboardStore((state) => state.visiblePanels)

  const replayActive = useReplayStore((state) => state.active)
  const replayDevices = useReplayStore((state) => state.replayDevices)
  useEventReplay(initialDevices, simulationStartedAt)

  const activeDevicesById = replayActive && replayDevices ? replayDevices : liveDevices
  const devices = Object.values(activeDevicesById)
  const filteredDevices = filterDevices(devices, filters)
  const selectedDevice = selectedDeviceId ? (activeDevicesById[selectedDeviceId] ?? null) : null

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
      <OfflineBanner />

      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
        <div>
          <h1 className="text-lg font-semibold">Command Center</h1>
          <p className="text-muted-foreground text-xs">
            Centro de operações — dispositivos IoT em tempo real (simulado)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <DeviceStats />
          <DashboardLayoutToggle />
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="text-muted-foreground hover:bg-muted flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs"
          >
            Buscar dispositivo
            <kbd className="bg-muted rounded border px-1.5 py-0.5 text-[10px]">Ctrl K</kbd>
          </button>
          <ThemeToggle />
        </div>
      </header>

      <DeviceFilters />
      <EventReplayPanel />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          {visiblePanels.map && (
            <div className="min-h-0 flex-1">
              <ErrorBoundary
                fallback={
                  <div className="text-muted-foreground flex h-full items-center justify-center p-6 text-center text-sm">
                    Não foi possível carregar o mapa (WebGL indisponível neste ambiente). A tabela
                    abaixo continua funcionando normalmente.
                  </div>
                }
              >
                <Suspense fallback={<Skeleton className="h-full w-full" />}>
                  <DeviceMap
                    devices={filteredDevices}
                    selectedDeviceId={selectedDeviceId}
                    onSelectDevice={selectDevice}
                    theme={theme}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>
          )}
          {visiblePanels.table && (
            <div className="h-72 shrink-0 border-t p-2">
              <DeviceTable
                devices={filteredDevices}
                selectedDeviceId={selectedDeviceId}
                onSelectDevice={selectDevice}
              />
            </div>
          )}
        </div>

        <aside className="hidden w-80 shrink-0 flex-col overflow-hidden border-l lg:flex">
          <DeviceDetailPanel device={selectedDevice} />
          {visiblePanels.chart && (
            <div className="h-48 shrink-0 border-t p-2">
              <Suspense fallback={<Skeleton className="h-full w-full" />}>
                <StatusHistoryChart history={statusHistory} theme={theme} />
              </Suspense>
            </div>
          )}
          {visiblePanels.timeline && (
            <div className="min-h-0 flex-1 border-t">
              <EventTimeline />
            </div>
          )}
        </aside>
      </div>

      <CommandPalette />
    </div>
  )
}

export default App
