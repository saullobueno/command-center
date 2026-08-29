# 0008 — Basemap do MapLibre: CARTO Positron (gratuito, sem chave)

## Contexto

MapLibre GL não inclui um basemap — precisa de uma URL de estilo (`style.json`)
apontando para fontes de tiles. Opções sem custo e sem cartão de crédito:

- `demotiles.maplibre.org` — estilo de demonstração oficial do MapLibre, mas
  só mostra contornos de países, sem ruas/cidades — visualmente pobre para
  um mapa operacional.
- **CARTO Basemaps** (`basemaps.cartocdn.com`) — estilos vetoriais
  Positron/Voyager/Dark Matter, gratuitos, sem necessidade de chave de API
  ou cadastro, usados amplamente por projetos open-source com MapLibre.
  Confirmado acessível (`GET .../positron-gl-style/style.json` → 200) em
  2026-08-29.

## Decisão

Usar `https://basemaps.cartocdn.com/gl/positron-gl-style/style.json` como
estilo base do mapa (claro) e `dark-matter-gl-style` como equivalente para
o modo escuro (Fase 4).

## Consequências

- Dependência de um serviço de terceiros gratuito, mas fora do nosso
  controle — se a CARTO mudar a política de uso, o mapa quebra. Como é uma
  peça de portfólio (não produção), o risco é aceitável; se acontecer,
  trocar a URL do estilo é uma mudança de uma linha.
- Sem chave de API para gerenciar/vazar — nada de segredo no cliente.
