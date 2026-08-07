# BMCenter Smartphones v10.2.0 — revisão consolidada

## Interface
- Paletas claro/escuro preservadas conforme Dashboard aprovada.
- Dashboard: KPIs reorganizados sem sobreposição de texto.
- Hoje: etapas compactadas em grade para reduzir rolagem.
- Smartphones: lista densa sem área de fotos.
- Anúncios: lista densa com canais, progresso e ações compactas.
- Ações em lote: seleção e alterações em barra compacta; aparelhos em grade densa.
- Atividades: timeline compacta.
- Peças e acessórios: novo agrupamento e fluxo sem controle de estoque exposto.
- Central de dados e Backup: fundo contínuo em tema escuro.
- Configurações > Aparência: somente Claro/Escuro, com a paleta aprovada.
- Menu lateral: sem busca duplicada, sem seletor de tema, scrollbar invisível; tema no topo.
- Fornecedores e Contas bancárias movidos para Configurações.

## Recursos enxutos
- Código BM-xxxx respeita a configuração global de visibilidade.
- Campos obsoletos de prioridade/planejamento/vendedor/fornecedor de compra/acessórios/controle de fotos são removidos dos registros ao migrar/salvar.
- Estoque de peças não gera alertas operacionais.

## Backup
- Formato de backup v3.
- Captura dinamicamente todas as chaves `bmcenter-*` do localStorage, exceto a sessão da nuvem.
- Inclui configurações, tema, menus, layouts, colunas, aparelhos, anúncios, perfis, fornecedores, contas, bibliotecas e quaisquer novas chaves BMCenter futuras.
- Auditoria interna interrompe a criação se alguma chave elegível não for capturada.
- Backups da nuvem podem ser Baixados, Restaurados ou Excluídos.

## Validações estáticas executadas
- 36 arquivos JS/JSX verificados: 0 erros de sintaxe.
- Imports locais verificados: 0 ausentes.
- CSS principal, V10 e V10.2 analisados: 0 erros de parsing.
