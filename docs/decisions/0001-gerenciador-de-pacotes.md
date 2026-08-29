# 0001 — Gerenciador de pacotes: npm

## Contexto

O stack foi definido pelo usuário (React 19, Vite, TanStack Query/Table,
Zustand, ECharts, MapLibre GL, Tailwind, shadcn/ui, React Hook Form, Zod,
MSW, Vitest, Playwright, Storybook), mas o gerenciador de pacotes não foi
especificado. O ambiente já tinha `npm` 11.18.0 disponível globalmente.

## Decisão

Usar `npm` como gerenciador de pacotes, sem introduzir `pnpm` ou `yarn`.

## Consequências

- Um dependente a menos para instalar/manter no ambiente do agente.
- `npm` 11 já traz um mecanismo de allowlist de scripts de instalação
  (bloqueia `postinstall` de pacotes como o `msw` por padrão); scripts que
  dependem de um postinstall (ex.: `msw init`) precisam ser rodados
  manualmente via CLI do próprio pacote.
- Sem ganho de performance de instalação que `pnpm` traria em monorepos —
  irrelevante aqui, pois o projeto é um pacote único.
