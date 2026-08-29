# Command Center

Centro de operações em tempo real para uma operação fictícia de
IoT/logística/energia — milhares de dispositivos num mapa interativo,
métricas ao vivo, timeline de eventos, alertas e um **Event Replay** que
permite escolher uma janela de tempo (`10:32 → 10:45`) e assistir aos
dispositivos mudando de estado como se estivesse acontecendo agora.

Projeto de portfólio: sem backend real, sem dados de usuários reais, sem
serviços pagos. Toda a "infraestrutura" (dispositivos, eventos, WebSocket)
é simulada no cliente via MSW.

## Stack

- **React 19** + **TypeScript** + **Vite**
- **TanStack Query** (dados assíncronos/cache) + **Zustand** (estado de UI/domínio)
- **TanStack Table** (tabelas virtualizadas) + **TanStack Virtual**
- **ECharts** (gráficos realtime) + **MapLibre GL** (mapa interativo)
- **Tailwind CSS v4** + **shadcn/ui** (design system)
- **React Hook Form** + **Zod** (formulários e validação)
- **MSW** (simulação de API/WebSocket)
- **Vitest** + **Testing Library** (testes unitários/integração)
- **Playwright** (testes e2e)
- **Storybook** (catálogo de componentes)

## Como rodar

```bash
npm install
npm run dev              # servidor de desenvolvimento
npm run test              # testes unitários (uma vez)
npm run test:watch        # testes unitários (watch)
npm run test:e2e          # testes e2e (Playwright, precisa de build+preview)
npm run storybook         # catálogo de componentes
npm run typecheck         # checagem de tipos
npm run lint               # oxlint
npm run format             # prettier --write
npm run build              # build de produção
```

## Decisões de arquitetura

Decisões que não eram óbvias a partir do código estão documentadas como ADR
em [`docs/decisions/`](./docs/decisions/).

## Status

Projeto em construção ativa. Veja `CLAUDE.md` para o estado atual das fases.

- ✅ Fase 1 — scaffold e tooling
- ✅ Fase 2 — fundação de dados/estado (dispositivos simulados, tempo real determinístico)
- ✅ Fase 3 — fluxo vertical completo: mapa interativo (MapLibre, clustering),
  tabela virtualizada, timeline de eventos, filtros, command palette (Ctrl+K)
- ⏳ Fase 4 — Event Replay, dashboard configurável, gráficos ECharts, dark
  mode, PWA, polimento final
