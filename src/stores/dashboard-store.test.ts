import { beforeEach, describe, expect, it } from 'vitest'
import { useDashboardStore } from './dashboard-store'

describe('useDashboardStore', () => {
  beforeEach(() => {
    useDashboardStore.setState({
      visiblePanels: { map: true, table: true, timeline: true, chart: true },
    })
  })

  it('togglePanel inverte só o painel informado', () => {
    useDashboardStore.getState().togglePanel('chart')

    const { visiblePanels } = useDashboardStore.getState()
    expect(visiblePanels.chart).toBe(false)
    expect(visiblePanels.map).toBe(true)
    expect(visiblePanels.table).toBe(true)
    expect(visiblePanels.timeline).toBe(true)
  })

  it('togglePanel duas vezes volta ao estado original', () => {
    useDashboardStore.getState().togglePanel('map')
    useDashboardStore.getState().togglePanel('map')
    expect(useDashboardStore.getState().visiblePanels.map).toBe(true)
  })
})
