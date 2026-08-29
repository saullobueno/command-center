# 0002 — Lint com oxlint, formatação com Prettier

## Contexto

O template oficial `create-vite react-ts` (versão publicada em 2026) já vem
com `oxlint` pré-configurado em vez de ESLint — um linter escrito em Rust,
ordens de magnitude mais rápido, com plugins para `react`, `typescript` e
regras nativas do `oxc`. O stack pedido pelo usuário não especificava
ferramenta de lint/format.

## Decisão

Manter `oxlint` (linter) como veio no scaffold oficial, e adicionar
`prettier` (formatador) com o plugin `prettier-plugin-tailwindcss` para
ordenar classes utilitárias automaticamente. Não adotar `oxfmt` (formatador
nativo do oxc) por ainda estar em versão `0.x`, portanto instável demais
para uma peça de portfólio que precisa de tooling previsível.

## Consequências

- Sem ESLint no projeto — qualquer regra específica de uma lib (ex.: regras
  de acessibilidade de um plugin ESLint que não tenha equivalente em
  oxlint) precisa ser avaliada caso a caso; se necessário, ESLint pode ser
  adicionado depois só para essas regras, rodando em paralelo ao oxlint.
- `npm run lint` e `npm run format` ficam como comandos separados (lint não
  formata, format não linta).
