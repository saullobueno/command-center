import {
  MapLibreMap,
  NavigationControl,
  type GeoJSONSource,
  type MapLayerMouseEvent,
} from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useRef } from 'react'
import { devicesToGeoJSON } from '@/lib/device-geojson'
import type { Theme } from '@/stores/theme-store'
import type { Device, DeviceStatus } from '@/types/device'

const STYLE_URL: Record<Theme, string> = {
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
}
const SOURCE_ID = 'devices'
const BRAZIL_CENTER: [number, number] = [-51, -15]

const STATUS_COLOR: Record<DeviceStatus, string> = {
  online: '#16a34a',
  warning: '#eab308',
  offline: '#dc2626',
}

function setupDeviceLayers(map: MapLibreMap, onSelectDevice: (id: string) => void) {
  map.addSource(SOURCE_ID, {
    type: 'geojson',
    data: devicesToGeoJSON([]),
    cluster: true,
    clusterRadius: 40,
    clusterMaxZoom: 12,
  })

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: SOURCE_ID,
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': '#64748b',
      'circle-radius': ['step', ['get', 'point_count'], 16, 50, 20, 200, 26],
      'circle-opacity': 0.85,
    },
  })

  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: SOURCE_ID,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-size': 12,
    },
    paint: { 'text-color': '#fff' },
  })

  map.addLayer({
    id: 'devices-unclustered',
    type: 'circle',
    source: SOURCE_ID,
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-radius': 6,
      'circle-stroke-width': 1.5,
      'circle-stroke-color': '#fff',
      'circle-color': [
        'match',
        ['get', 'status'],
        'online',
        STATUS_COLOR.online,
        'warning',
        STATUS_COLOR.warning,
        'offline',
        STATUS_COLOR.offline,
        '#94a3b8',
      ],
    },
  })

  map.on('click', 'devices-unclustered', (event: MapLayerMouseEvent) => {
    const id = event.features?.[0]?.properties?.id
    if (typeof id === 'string') onSelectDevice(id)
  })

  map.on('click', 'clusters', (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0]
    if (!feature) return
    const clusterId = feature.properties?.cluster_id
    if (clusterId == null) return

    const source = map.getSource(SOURCE_ID) as GeoJSONSource
    source.getClusterExpansionZoom(clusterId).then((zoom: number) => {
      const [lng, lat] = (feature.geometry as GeoJSON.Point).coordinates as [number, number]
      map.easeTo({ center: [lng, lat], zoom })
    })
  })

  for (const layerId of ['devices-unclustered', 'clusters']) {
    map.on('mouseenter', layerId, () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', layerId, () => {
      map.getCanvas().style.cursor = ''
    })
  }
}

interface DeviceMapProps {
  devices: Device[]
  selectedDeviceId: string | null
  onSelectDevice: (id: string) => void
  theme: Theme
}

export function DeviceMap({ devices, selectedDeviceId, onSelectDevice, theme }: DeviceMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const onSelectDeviceRef = useRef(onSelectDevice)
  const initialThemeRef = useRef(theme)
  useEffect(() => {
    onSelectDeviceRef.current = onSelectDevice
  }, [onSelectDevice])

  useEffect(() => {
    if (!containerRef.current) return

    const map = new MapLibreMap({
      container: containerRef.current,
      style: STYLE_URL[initialThemeRef.current],
      center: BRAZIL_CENTER,
      zoom: 3.2,
    })
    mapRef.current = map

    map.addControl(new NavigationControl({ showCompass: false }), 'top-right')
    map.on('load', () => setupDeviceLayers(map, (id) => onSelectDeviceRef.current(id)))

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    map.setStyle(STYLE_URL[theme])
    map.once('style.load', () => setupDeviceLayers(map, (id) => onSelectDeviceRef.current(id)))
  }, [theme])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const applyData = () => {
      const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined
      source?.setData(devicesToGeoJSON(devices))
    }

    if (map.isStyleLoaded()) applyData()
    else map.once('load', applyData)
  }, [devices])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedDeviceId) return
    const device = devices.find((d) => d.id === selectedDeviceId)
    if (!device) return
    map.easeTo({ center: [device.lng, device.lat], zoom: Math.max(map.getZoom(), 10) })
  }, [selectedDeviceId, devices])

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      role="application"
      aria-label="Mapa de dispositivos"
    />
  )
}
