import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { StatusHistoryChart } from './status-history-chart'

vi.mock('echarts-for-react/esm/core', () => ({
  default: () => <div data-testid="status-chart" />,
}))

describe('StatusHistoryChart', () => {
  it('mostra estado de espera quando não há histórico suficiente', () => {
    render(<StatusHistoryChart history={[]} theme="light" />)
    expect(screen.getByText(/aguardando dados suficientes/i)).toBeInTheDocument()
  })

  it('mostra estado de espera com um único ponto de histórico', () => {
    render(
      <StatusHistoryChart
        history={[{ timestamp: new Date().toISOString(), online: 1, warning: 0, offline: 0 }]}
        theme="dark"
      />,
    )
    expect(screen.getByText(/aguardando dados suficientes/i)).toBeInTheDocument()
  })

  it('renderiza o gráfico quando há histórico suficiente', () => {
    render(
      <StatusHistoryChart
        history={[
          { timestamp: '2026-08-29T16:00:00.000Z', online: 12, warning: 2, offline: 1 },
          { timestamp: '2026-08-29T16:01:00.000Z', online: 13, warning: 1, offline: 1 },
        ]}
        theme="light"
      />,
    )

    expect(screen.getByTestId('status-chart')).toBeInTheDocument()
  })
})
