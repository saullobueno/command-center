import { beforeEach, describe, expect, it } from 'vitest'
import { useUiStore } from './ui-store'

describe('useUiStore', () => {
  beforeEach(() => {
    useUiStore.getState().resetFilters()
    useUiStore.setState({ selectedDeviceId: null, commandPaletteOpen: false })
  })

  it('toggleStatus adiciona e depois remove o status do conjunto', () => {
    useUiStore.getState().toggleStatus('warning')
    expect(useUiStore.getState().filters.statuses.has('warning')).toBe(true)

    useUiStore.getState().toggleStatus('warning')
    expect(useUiStore.getState().filters.statuses.has('warning')).toBe(false)
  })

  it('toggleType não afeta o conjunto de status', () => {
    useUiStore.getState().toggleType('sensor')
    expect(useUiStore.getState().filters.types.has('sensor')).toBe(true)
    expect(useUiStore.getState().filters.statuses.size).toBe(0)
  })

  it('resetFilters volta ao estado inicial', () => {
    useUiStore.getState().setSearch('abc')
    useUiStore.getState().toggleStatus('offline')
    useUiStore.getState().setSiteId('site-sp')

    useUiStore.getState().resetFilters()

    const { filters } = useUiStore.getState()
    expect(filters.search).toBe('')
    expect(filters.statuses.size).toBe(0)
    expect(filters.siteId).toBeNull()
  })

  it('selectDevice e setCommandPaletteOpen atualizam o estado correspondente', () => {
    useUiStore.getState().selectDevice('dev-1')
    expect(useUiStore.getState().selectedDeviceId).toBe('dev-1')

    useUiStore.getState().setCommandPaletteOpen(true)
    expect(useUiStore.getState().commandPaletteOpen).toBe(true)
  })
})
