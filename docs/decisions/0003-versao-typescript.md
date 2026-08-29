# 0003 — TypeScript fixado em 6.0.2 (não 7.x)

## Contexto

Em 2026-08, o dist-tag `latest` do pacote `typescript` no npm aponta para a
`7.0.2` — a reescrita nativa do compilador (o antigo projeto "Corsa"). O
scaffold oficial do Vite (`create-vite@latest react-ts`), porém, ainda fixa
`~6.0.2` como dependência de projeto.

## Decisão

Seguir a versão fixada pelo próprio scaffold oficial do Vite (`~6.0.2`) em
vez de forçar o upgrade para `7.x`, mesmo sendo essa a tag `latest` do
registry.

## Consequências

- `tsc -b` (build de projeto com project references, usado no script
  `build`) e o `@vitejs/plugin-react` foram validados pela própria equipe
  do Vite contra a 6.0.2; não há garantia equivalente para a 7.x ainda.
- Reavaliar este ADR quando o template oficial do Vite migrar para a 7.x —
  nesse ponto, a atualização deste projeto deve seguir o mesmo trilho.
