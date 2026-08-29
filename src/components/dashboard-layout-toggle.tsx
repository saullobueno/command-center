import { Badge } from '@/components/ui/badge'
import { useDashboardStore, type PanelId } from '@/stores/dashboard-store'

const PANEL_LABEL: Record<PanelId, string> = {
  map: 'Mapa',
  table: 'Tabela',
  timeline: 'Timeline',
  chart: 'Gráfico',
}

const PANELS: PanelId[] = ['map', 'table', 'timeline', 'chart']

export function DashboardLayoutToggle() {
  const visiblePanels = useDashboardStore((state) => state.visiblePanels)
  const togglePanel = useDashboardStore((state) => state.togglePanel)

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Painéis visíveis">
      {PANELS.map((panel) => (
        <button key={panel} type="button" onClick={() => togglePanel(panel)}>
          <Badge variant={visiblePanels[panel] ? 'default' : 'outline'}>{PANEL_LABEL[panel]}</Badge>
        </button>
      ))}
    </div>
  )
}
