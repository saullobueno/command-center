import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// Build mínimo do ECharts: só o necessário para o gráfico de status ao
// vivo (linha empilhada). O import "echarts-for-react" sem isso puxa a
// biblioteca inteira (pizza, mapa, candlestick, SVG renderer...) e infla
// o bundle em ~1.2MB à toa.
echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer])

export { echarts }
