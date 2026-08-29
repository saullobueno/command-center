# 0004 — Interface em pt-BR

## Contexto

O briefing do projeto foi passado inteiramente em português e o usuário
trabalha em uma empresa brasileira (`econform.com.br`). O stack e as
features foram especificados, mas o idioma da UI (texto visível, `lang` do
HTML, mensagens de erro) não foi.

## Decisão

Interface, textos de UI e mensagens voltadas ao usuário final em
**pt-BR** (`<html lang="pt-BR">`). Nomes de variáveis, componentes,
commits e comentários de código continuam em inglês (convenção usual de
código, independente do idioma do produto).

## Consequências

- Textos fixos na UI (labels, mensagens de erro de formulário, estados
  vazios) devem ser escritos em pt-BR desde o início — não há camada de
  i18n neste projeto (fora de escopo para uma peça de portfólio).
- Se o objetivo mudar para um público internacional, precisaria de uma
  biblioteca de i18n retroativa; não foi adicionada preventivamente para
  não introduzir abstração sem uso real (ver regras de "não superengenhar"
  do projeto).
