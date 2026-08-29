import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from '@/mocks/node'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// jsdom não implementa WebGL, então o maplibre-gl real sempre falha ao
// inicializar em testes. Mockamos a superfície mínima usada por
// src/components/devices/device-map.tsx.
vi.mock('maplibre-gl', () => {
  class MockGeoJSONSource {
    setData = vi.fn()
    getClusterExpansionZoom = vi.fn(() => Promise.resolve(10))
  }

  class MockMap {
    on = vi.fn()
    once = vi.fn()
    addControl = vi.fn()
    addSource = vi.fn()
    addLayer = vi.fn()
    getSource = vi.fn(() => new MockGeoJSONSource())
    getCanvas = vi.fn(() => ({ style: {} }))
    isStyleLoaded = vi.fn(() => false)
    easeTo = vi.fn()
    getZoom = vi.fn(() => 3)
    remove = vi.fn()
  }

  class MockNavigationControl {}

  return {
    MapLibreMap: MockMap,
    NavigationControl: MockNavigationControl,
  }
})
