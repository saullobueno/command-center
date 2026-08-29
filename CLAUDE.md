# CLAUDE.md

Contexto de trabalho para agentes neste repositório. Ver `README.md` para
visão geral do produto e `docs/decisions/` para o porquê de cada escolha
não-óbvia de stack.

## Estado do projeto

Portfólio pessoal, construído de forma autônoma em fases (ver
`docs/decisions/` e o histórico de commits). Fase atual: **Fase 3 — fluxo
vertical completo** (mapa, tabela virtualizada, timeline, filtros e
command palette funcionando ponta a ponta sobre a fundação da Fase 2).
Ainda faltam: Event Replay, dashboard configurável, dark mode, PWA — isso
é Fase 4. Não assuma que features de fases posteriores existem até que o
commit correspondente apareça no histórico.

## Camada de dados/estado (Fase 2)

- `src/types/` — `Device`, `Site`, `DeviceEvent`.
- `src/lib/mock/` — geração determinística de dispositivos (`devices.ts`),
  simulação de tick em tempo real (`realtime.ts`), seeds/config
  (`config.ts`). Tudo alimentado por `src/lib/random.ts` (PRNG com seed) —
  nunca use `Math.random()` nesta camada, quebra o determinismo necessário
  para o Event Replay (ver `docs/decisions/0007-simulacao-tempo-real.md`).
- `src/stores/device-store.ts` — Zustand, estado ao vivo dos dispositivos.
  Ver `docs/decisions/0006-camadas-de-estado.md` para a fronteira entre
  isso e o TanStack Query.
- `src/hooks/use-devices-query.ts` + `use-realtime-sync.ts` — chamados a
  partir de `App.tsx`.

## UI do fluxo principal (Fase 3)

- `src/components/devices/` — mapa (`device-map.tsx`, MapLibre + CARTO,
  ver `docs/decisions/0008-tiles-do-mapa.md`), tabela virtualizada
  (`device-table.tsx` + `device-table-columns.tsx`, TanStack Table v8 — ver
  `docs/decisions/0009-tanstack-table-v8.md` — + TanStack Virtual),
  timeline (`event-timeline.tsx`), filtros (`device-filters.tsx`), painel
  de detalhe (`device-detail-panel.tsx`).
- `src/stores/ui-store.ts` — Zustand, estado de UI compartilhado (filtros,
  dispositivo selecionado, abertura do command palette). Filtragem em si é
  uma função pura testável em `src/lib/filter-devices.ts`.
- `src/components/command-palette.tsx` — Ctrl+K/Cmd+K, busca dispositivos
  por nome. Renderiza no máximo 50 resultados por vez (não deixe a lista
  crescer sem paginação/corte — são milhares de dispositivos, `cmdk` não
  virtualiza sozinho).
- `src/components/error-boundary.tsx` — usado ao redor do `<DeviceMap />`
  porque WebGL pode falhar de verdade (e falha sempre em jsdom). Ver
  `docs/decisions/0010-error-boundary-no-mapa.md`.

## Convenções

- Gerenciador de pacotes: `npm` (não usar `pnpm`/`yarn`).
- Alias de import: `@/*` aponta para `src/*` (configurado em
  `tsconfig.json`, `tsconfig.app.json` e via `resolve.tsconfigPaths: true`
  nativo do Vite — sem plugin extra).
- Estilo de código: sem ponto e vírgula, aspas simples (ver
  `.prettierrc.json`). Rode `npm run format` antes de commitar.
- Lint: `oxlint` (não ESLint — ver `docs/decisions/0002-lint-e-formatacao.md`).
- Componentes shadcn/ui ficam em `src/components/ui` e são gerados via
  `npx shadcn add <componente>` — não edite à mão um componente `ui/`
  gerado; se precisar de customização, componha por cima em
  `src/components/`.
- Mocks de rede (MSW) ficam em `src/mocks/`: `handlers.ts` é a fonte única
  de handlers, `browser.ts`/`node.ts` fazem o setup para cliente/teste.

## Gotchas de ambiente (descobertos na prática)

- **npm 11 bloqueia scripts de `postinstall`** por padrão (allowlist de
  scripts). O `postinstall` do `msw` (que gera `public/mockServiceWorker.js`)
  não roda sozinho — depois de instalar/atualizar o `msw`, rode
  `npx msw init public --save` manualmente.
- **CLI do shadcn/ui não é totalmente não-interativa** mesmo com `-y`:
  prompts de "sobrescrever `components.json`?" e "reinstalar componentes?"
  precisam de `-f --no-reinstall` explícitos, senão o comando aborta sem
  erro claro quando rodado sem TTY.
- **`jsdom` mais recente (30.x) exige Node `^24.15`**; o ambiente de
  desenvolvimento tem Node `24.12`. Está fixado em `29.1.1` — se o Node for
  atualizado, reavaliar se dá para voltar à última versão do jsdom.
- **TypeScript está fixado em `~6.0.2`**, não na tag `latest` (`7.x`) — ver
  `docs/decisions/0003-versao-typescript.md`.
- **`baseUrl` no `tsconfig` está deprecated no TS 6** (removido no TS 7) —
  use só `paths` sem `baseUrl` (funciona desde o TS 4.1 com resolução
  `bundler`/`node`).
- **Não reintroduza `@storybook/addon-vitest`** sem antes confirmar que o
  bug de interop CJS→ESM no modo browser do Vitest foi corrigido upstream —
  ver `docs/decisions/0005-storybook-sem-addon-vitest.md`.
- **`enableMocking()` precisa rodar em todo `MODE`**, não só em
  desenvolvimento — este projeto não tem backend real, então o MSW é a API
  permanente. Ver `docs/decisions/0011-msw-sempre-ativo.md`. Se o app ficar
  preso no skeleton de carregamento no `npm run preview`/build de produção,
  é o primeiro lugar a checar.
- **`page.keyboard.press('Control+K')` do Playwright é interceptado pelo
  Chromium headless** antes de chegar à página (mesmo atalho que a omnibox
  do navegador usa) — o listener `keydown` do app nunca dispara. Em e2e,
  dispare o evento diretamente: `page.evaluate(() =>
document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k',
ctrlKey: true, bubbles: true })))` (ver `e2e/command-palette.spec.ts`).
- **jsdom não tem WebGL nem `ResizeObserver`**: `maplibre-gl` é mockado
  globalmente em `src/test/setup.ts` (`vi.mock('maplibre-gl', ...)`, com
  named exports — a lib não tem export default). TanStack Virtual precisa
  de `offsetHeight` não-zero no container de scroll para renderizar linhas
  em teste; sem isso a lista aparece vazia mesmo com dados (ver
  `beforeEach` em `device-table.test.tsx`).

## Comandos de qualidade (rodar antes de qualquer commit)

```bash
npm run typecheck && npm run lint && npm run format:check && npm run test && npm run build
```
