# CLAUDE.md

Contexto de trabalho para agentes neste repositório. Ver `README.md` para
visão geral do produto e `docs/decisions/` para o porquê de cada escolha
não-óbvia de stack.

## Estado do projeto

Portfólio pessoal, construído de forma autônoma em fases (ver
`docs/decisions/` e o histórico de commits). Fase atual: **Fase 1 —
scaffold e tooling**. Não assuma que features de fases posteriores (mapa,
Event Replay, dashboard configurável) existem até que o commit
correspondente apareça no histórico.

## Convenções

- Gerenciador de pacotes: `npm` (não usar `pnpm`/`yarn`).
- Alias de import: `@/*` aponta para `src/*` (configurado em
  `tsconfig.json`, `tsconfig.app.json` e via `vite-tsconfig-paths`).
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

## Comandos de qualidade (rodar antes de qualquer commit)

```bash
npm run typecheck && npm run lint && npm run format:check && npm run test && npm run build
```
