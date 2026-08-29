# 0005 — Storybook sem integração `addon-vitest` (modo browser)

## Contexto

`storybook init` (v10.5.10) configura por padrão o `@storybook/addon-vitest`,
que roda as stories como testes dentro do Vitest em **modo browser** (via
`@vitest/browser-playwright`), como um segundo "projeto" no `vite.config.ts`.

Ao rodar `npm run test`, esse projeto falhava de forma consistente com
`SyntaxError: The requested module '...' does not provide an export named
'default'/'elementRoles'` — primeiro em `aria-query`, depois (após
contornar com `optimizeDeps.include`) em `lz-string`. São dependências
transitivas diferentes de `@storybook/addon-vitest`/`@storybook/addon-a11y`,
cada uma falhando no mesmo padrão de interop CJS→ESM dentro do worker de
browser do Vitest. Não é um problema no código do projeto — é uma
combinação instável de Storybook 10.5 + Vitest 4 + Vite 8 recém-lançados.

## Decisão

Remover `@storybook/addon-vitest` e `@vitest/browser-playwright` do
projeto. `vite.config.ts` volta a ter um único bloco `test` (ambiente
`jsdom`, sem `projects`). O Storybook continua no projeto só como catálogo
de componentes (`npm run storybook` / `npm run build-storybook`), sem rodar
como parte da suíte de testes.

## Consequências

- Stories não são executadas automaticamente como testes — cobertura de
  comportamento de componentes continua vindo de testes normais com
  Testing Library em `*.test.tsx` (Vitest + jsdom).
- Se essa combinação de versões for corrigida upstream (acompanhar releases
  do `@storybook/addon-vitest`), reavaliar a reintrodução — o ganho
  (testar todas as stories automaticamente, incluindo a11y) é real.
- Também removido `@storybook/addon-mcp` (expõe o Storybook via MCP para
  agentes de IA — sem uso aqui) porque trazia uma dependência transitiva
  (`valibot`) com vulnerabilidade moderada conhecida; sem ele, `npm audit`
  está limpo.
