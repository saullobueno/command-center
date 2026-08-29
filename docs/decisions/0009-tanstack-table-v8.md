# 0009 — TanStack Table fixado em v8, não v9

## Contexto

`npm view @tanstack/react-table version` (tag `latest`) aponta para `9.2.4`
em 2026-08. Ao implementar a tabela virtualizada de dispositivos com a API
v8 (`useReactTable`, `getCoreRowModel`, `getSortedRowModel`, `ColumnDef`,
`flexRender`) — a API estável, amplamente documentada e usada em quase todo
tutorial/exemplo existente — o typecheck falhou: a v9 reorganizou o core
inteiro num modelo "feature-based" diferente (`createCoreRowModel`,
`constructTable`, `assignTableAPIs`, dezenas de `*Feature` exportados de
`@tanstack/table-core`), sem o hook `useReactTable` nem os nomes de função
que a v8 usa.

## Decisão

Fixar `@tanstack/react-table` em `8.21.3` (última release da série 8, que
ainda é publicada e mantida), em vez de adotar a v9 recém-lançada.

## Consequências

- A tabela usa a API v8 (`useReactTable`, `getCoreRowModel()`,
  `getSortedRowModel()`, `flexRender`) — a mesma documentada nos exemplos
  oficiais e no restante do ecossistema no momento em que este projeto foi
  construído.
- Se um dia vier a valer a pena migrar para v9 (ganho de performance ou
  features novas que justifiquem o esforço), isso é uma migração isolada
  em `src/components/devices/device-table*.tsx` — a v9 muda a API de
  construção da tabela, não o modelo de dados (`Device[]`) nem a
  virtualização (`@tanstack/react-virtual`, que é um pacote à parte e não
  foi afetado).
