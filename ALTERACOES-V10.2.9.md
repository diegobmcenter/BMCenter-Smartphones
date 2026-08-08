# BMCenter v10.2.9

## Mobile
- Topo mobile reconstruído em duas linhas.
- "Pesquisar no BMCenter" permanece visível e utilizável no celular.
- Smartphones redesenhado para mobile, sem campos financeiros estourando a largura.
- Filtros, botões, cards e ações reorganizados para telas estreitas.
- Modais de cadastro/edição e cadastro em massa passam a usar duas colunas compactas no celular.
- Salvaguarda global contra overflow horizontal.

## Backup auditado para uso real
- Formato de backup elevado para v4.
- Continua capturando automaticamente toda chave persistente `bmcenter-*`, exceto a sessão de autenticação da nuvem.
- Inclui estado de sessão relevante, como página atual e posição, excluindo identificador efêmero do cliente.
- Auditoria explícita de smartphones, anúncios embutidos, perfis, fornecedores, contas, peças, movimentos, templates, bibliotecas de anúncios, checklists, metas, visualizações, tema, colunas, layouts, escalas de fonte, menus e snapshots.
- Backup contabiliza anúncios, histórico dos aparelhos e peças vinculadas.
- Restauração agora relê todas as chaves gravadas e aborta se detectar divergência.
- Preferências de tema, brilho, modo leitura e escala individual de fonte permanecem incluídas.
