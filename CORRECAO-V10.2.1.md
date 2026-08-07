# BMCenter v10.2.1 — correção estrutural do tema escuro

## Causa raiz identificada
O arquivo legado `styles.css` contém uma regra global para o elemento `header`
com `background:#fff`, altura fixa e posicionamento sticky. Componentes modernos
também usam `<header>`, portanto essa regra antiga vazava para páginas V102 e
criava as faixas brancas vistas em Dashboard, Hoje, Smartphones, Ações em lote,
Atividades e Configurações.

## Correção
- Reset de elemento `header` limitado ao escopo `.v102-app`, usando `:where()`
  para não aumentar especificidade.
- Componentes V102 continuam livres para definir seus próprios cabeçalhos.
- `html` e `body` passam a acompanhar o tema ativo, evitando fundo claro residual
  no final de páginas curtas no modo escuro.
- Adicionado guardião de regressão para superfícies legadas claras dentro do
  tema escuro.
- Adicionada neutralização de `background:white/#fff` inline de componentes legados.
- Nenhuma alteração na paleta clara/escura aprovada.
