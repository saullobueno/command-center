export type EventSeverity = 'info' | 'warning' | 'critical'

export type DeviceEventType = 'status-change' | 'telemetry' | 'alert'

export interface DeviceEvent {
  id: string
  deviceId: string
  type: DeviceEventType
  severity: EventSeverity
  message: string
  timestamp: string
}
