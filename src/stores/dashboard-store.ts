import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PanelId = 'map' | 'table' | 'timeline' | 'chart'

interface DashboardStoreState {
  visiblePanels: Record<PanelId, boolean>
  togglePanel: (panel: PanelId) => void
}

export const useDashboardStore = create<DashboardStoreState>()(
  persist(
    (set) => ({
      visiblePanels: { map: true, table: true, timeline: true, chart: true },
      togglePanel: (panel) =>
        set((state) => ({
          visiblePanels: { ...state.visiblePanels, [panel]: !state.visiblePanels[panel] },
        })),
    }),
    { name: 'command-center-dashboard' },
  ),
)
