import ReactEChartsCore from 'echarts-for-react/esm/core'
import { useMemo } from 'react'
import { echarts } from '@/lib/echarts-core'
import type { StatusSnapshot } from '@/stores/device-store'
import type { Theme } from '@/stores/theme-store'

const SERIES_COLOR = {
  online: '#16a34a',
  warning: '#eab308',
  offline: '#dc2626',
}

interface StatusHistoryChartProps {
  history: StatusSnapshot[]
  theme: Theme
}

export function StatusHistoryChart({ history, theme }: StatusHistoryChartProps) {
  const option = useMemo(() => {
    const times = history.map((point) => new Date(point.timestamp).toLocaleTimeString('pt-BR'))
    const axisColor = theme === 'dark' ? '#374151' : '#e5e7eb'
    const textColor = theme === 'dark' ? '#d1d5db' : '#374151'

    return {
      backgroundColor: 'transparent',
      textStyle: { color: textColor },
      grid: { left: 32, right: 12, top: 12, bottom: 20 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: times,
        boundaryGap: false,
        axisLine: { lineStyle: { color: axisColor } },
        axisLabel: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: axisColor } },
        axisLabel: { color: textColor },
      },
      series: [
        {
          name: 'Online',
          type: 'line',
          stack: 'total',
          areaStyle: { opacity: 0.5 },
          showSymbol: false,
          smooth: true,
          data: history.map((point) => point.online),
          color: SERIES_COLOR.online,
        },
        {
          name: 'Alerta',
          type: 'line',
          stack: 'total',
          areaStyle: { opacity: 0.5 },
          showSymbol: false,
          smooth: true,
          data: history.map((point) => point.warning),
          color: SERIES_COLOR.warning,
        },
        {
          name: 'Offline',
          type: 'line',
          stack: 'total',
          areaStyle: { opacity: 0.5 },
          showSymbol: false,
          smooth: true,
          data: history.map((point) => point.offline),
          color: SERIES_COLOR.offline,
        },
      ],
    }
  }, [history, theme])

  if (history.length < 2) {
    return (
      <p className="text-muted-foreground p-4 text-sm">
        Aguardando dados suficientes para o gráfico...
      </p>
    )
  }

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: '100%', width: '100%' }}
      notMerge
    />
  )
}
