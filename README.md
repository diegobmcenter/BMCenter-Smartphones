# BMCenter Smartphones v0.1

Sistema web complementar para organizar smartphones próprios da BMCenter.

## Funciona nesta versão
- Login demonstrativo
- Dashboard
- Cadastro de smartphones
- Cadastro de vendedores
- Controle de peças e fornecedores
- Lista de compras agrupada por fornecedor
- Layout responsivo para computador e celular
- Dados salvos no navegador

## Login
- E-mail: `admin@bmcenter.local`
- Senha: `bmcenter123`

## Executar
```bash
npm install
npm run dev
```

## Novidades da v0.2.7

- Cadastro de contas bancárias.
- Seleção da conta usada no pagamento de cada aparelho.
- Várias cotações por peça.
- Sugestão automática do fornecedor mais barato.
- Possibilidade de escolher manualmente uma cotação mais cara.
- Tela de compras agrupada pelo fornecedor escolhido.

## Correções da v0.2.7

- Corrigido o botão “Adicionar cotação”.
- Campo de conta bancária destacado na seção “Dados da compra”.
- Compatibilidade com peças cadastradas na versão anterior.

## Novidades da v0.2.7

- Campo de preço agora exibe o texto “Preço”.
- Filtro por fornecedor na tela “Comprar peças”.
- Alternância entre agrupamento por fornecedor e por aparelho.
- Botão para copiar toda a lista de peças do fornecedor selecionado.
- Comparação entre menor cotação, cotação do fornecedor filtrado e fornecedor escolhido.

## Correções da v0.2.7

- Enter passa para o próximo campo em formulários.
- Enter no campo de nova peça executa “Adicionar peça”.
- Campo de preço mostra “PREÇO” quando vazio.
- Alterar o fornecedor escolhido não redireciona mais ao Dashboard.

## Novidades da v0.2.7

- Total em reais ao lado de cada aparelho no agrupamento por aparelho.
- Total em reais ao lado de cada fornecedor no agrupamento por fornecedor.
- Totais atualizados imediatamente ao trocar a cotação escolhida.
- Menor preço destacado em azul.
- Maior preço escolhido destacado em vermelho.
- Campo de cotação padronizado para “Preço”.
- Lista copiada para fornecedor agora inclui o total.

## Novidades da v0.2.7

- Cadastro separado de fornecedores.
- Fornecedores categorizados como aparelhos, peças ou ambos.
- Seleção do fornecedor no cadastro do aparelho.
- Seleção de fornecedores cadastrados nas cotações de peças.
- Campo “Fornecedor escolhido” permanece com fundo branco.
- Apenas a cor do texto muda: azul no menor preço e vermelho no maior.

## Correção da v0.2.7

- Corrigida a tela branca causada pela falta da importação do ícone do menu Fornecedores.

## Novidades da v0.2.7

- Alteração rápida do status diretamente na lista de smartphones.
- Controle de pedido por peça: não pedido, realizado, enviado e entregue.
- Ao realizar ou enviar um pedido, o aparelho muda automaticamente para “Aguardando peças”.
- Quando todas as peças forem entregues, o aparelho pode avançar automaticamente para “Em reparo”.
- As opções do fornecedor já aparecem coloridas ao abrir a lista: menor preço azul e maior preço vermelho.

## Novidades da v0.2.7

- O texto “Fornecedor” funciona apenas como indicação transparente quando nenhuma opção foi escolhida.
- A lista aberta mostra somente fornecedores cadastrados.
- Botão por fornecedor para marcar todas as peças daquele pedido como “Pedido realizado”.
- Ao marcar o pedido do fornecedor, os aparelhos envolvidos passam automaticamente para “Aguardando peças”.
- “Pedido realizado” agora é destacado em verde.

## Entrega v0.3.0

- Diagnóstico técnico completo por aparelho.
- Histórico/timeline automática.
- Gerador de título e descrição de anúncio.
- Controle de publicação por perfil.
- Cadastro local de usuários e funções.
- Cadastro de perfis usados nos anúncios.
- Backup completo em JSON.
- Restauração de backup.
- Indicadores rápidos de diagnóstico e anúncio na lista de smartphones.

## Ainda depende de configuração externa

A autenticação real, sincronização entre vários dispositivos e autorização de aparelhos serão conectadas ao Firebase na próxima versão. Esta v0.3 continua local para permitir validar todas as telas e regras antes de migrar os dados para a nuvem.

## Melhorias da v0.3.1

- Biblioteca de modelos personalizados para títulos e descrições.
- Quatro variações automáticas iniciais.
- Variáveis dinâmicas para preencher os modelos.
- Botão explícito para salvar o anúncio.
- Lista persistente de anúncios já preparados.
- Dashboard com anúncios preparados, publicados e os últimos anúncios salvos.
- Backup inclui os modelos de anúncio.

## Novidades da v0.3.2

- Vários anúncios diferentes para o mesmo aparelho.
- Nome interno para identificar cada anúncio.
- Exclusão individual de anúncios.
- Controle de perfis publicados separado por anúncio.
- Registro de venda com perfil responsável.
- Histórico da venda dentro do aparelho.
- Dashboard com ranking de vendas por perfil.
- Quantidade vendida e valor total vendido por perfil.
- Migração automática dos anúncios criados nas versões anteriores.

## Entrega v0.4.0

- Tela Operação em formato Kanban.
- Alteração rápida do estágio no quadro operacional.
- Histórico completo de vendas com filtros por perfil e mês.
- Remoção de venda para correções.
- Cálculo de custo total: valor pago + peças escolhidas.
- Lucro previsto e lucro realizado.
- Relatórios por perfil de anúncio.
- Relatórios mensais de faturamento e lucro.
- Relatório de compras por vendedor.
- Pesquisa e filtro de status na lista de smartphones.

## Correções da v0.4.1

- Corrigida a tela branca no menu Smartphones.
- Corrigidos os cálculos de custo e lucro usados em Smartphones, Vendas e Relatórios.
- Melhorada a consistência visual entre os menus.
- Adicionada uma tela de erro amigável caso algum módulo apresente problema.
- O botão “Registrar venda” permanece disponível na última coluna da tela Smartphones.

## Correções da v0.4.2

- Corrigida a alteração de largura do menu lateral ao abrir Relatórios.
- Menu lateral agora mantém largura fixa.
- Página Relatórios foi isolada para não empurrar ou deformar a navegação.
- Tabelas de Relatórios agora usam rolagem horizontal interna.

## Correção da v0.4.3

- Corrigida definitivamente a deformação do menu lateral em Relatórios.
- A correção anterior usava seletores `.app` e `.sidebar`, mas o sistema usa `.shell` e `aside`.
- A largura do menu agora permanece fixa em 240 px no computador.
- Os cards e tabelas de Relatórios não conseguem mais empurrar a coluna lateral.
- Textos longos nos relatórios passam a quebrar dentro dos próprios cards.

## Entrega v0.5.0

- Controle completo das fotos necessárias por aparelho.
- Controle de caixa, carregador, cabo, capinha, película, nota fiscal e outros acessórios.
- Etiquetas personalizadas como NFC, 5G, OLED e Dual Chip.
- Prioridade alta, média e baixa.
- Agenda operacional com próxima ação e data.
- Alertas de aparelhos parados há sete dias ou mais.
- Previsão de venda por data.
- Dashboard com previsão de valores para sete e trinta dias.
- Histórico automático de alterações no preço previsto.
- Pesquisa por código, modelo, IMEI, serial e etiquetas.
- Relatório de gastos por fornecedor de peças.
- Ranking de vendedores e perfis.
- Relatório das etiquetas mais usadas.

## Melhorias da v0.5.1

- Edição de vendas diretamente no menu Vendas.
- Botão Editar em cada venda registrada.
- Agenda agora permite criar e editar tarefas.
- Nova tarefa pode ser vinculada a qualquer aparelho ativo.
- A Agenda explica claramente quais informações recebe.
- As tarefas usam os campos próxima ação, data e prioridade do aparelho.

## Entrega v0.6.0

- Novo menu Estoque de peças.
- Quantidade, estoque mínimo, custo unitário, fornecedor e localização.
- Aviso de reposição quando a peça atinge o mínimo.
- Valor financeiro total do estoque de peças.
- Upload e visualização de fotos dentro do aparelho.
- Exclusão individual de fotos.
- Etiqueta visual com código QR.
- Impressão de etiqueta do aparelho.
- Porta 5173 fixada no Vite para evitar que os dados apareçam em branco ao trocar de versão.
- Backup agora inclui o estoque de peças.

## Entrega v0.7.0

- Integração entre pedidos de peças e estoque.
- Botão Receber adiciona automaticamente a peça ao estoque.
- Botão Instalar do estoque dá baixa na quantidade e marca a peça como instalada.
- Duplicação de cadastro de smartphone para acelerar aparelhos semelhantes.
- Novo menu Central de dados.
- Criação de até dez pontos internos de restauração.
- Restauração rápida de um ponto salvo.
- Exportação dos aparelhos e vendas em CSV para Excel.
- Limpeza protegida de todos os dados locais.
- Backup e restauração unificados por uma estrutura única.

## Entrega v0.8.0

- Menu de Anúncios totalmente reorganizado.
- Nova visão geral em formato de matriz, inspirada no controle por colunas usado no Excel.
- Cada linha representa um anúncio de um aparelho.
- Cada coluna representa um perfil de publicação.
- Clique direto na célula para marcar ou desmarcar onde o anúncio foi publicado.
- Células verdes indicam publicado; células vazias indicam pendente.
- Progresso visual por anúncio.
- Filtro por aparelho, anúncio, título e perfil.
- Botões para marcar todos os perfis ou limpar as marcações.
- Lista separada de aparelhos ainda sem nenhum anúncio.
- Editor de anúncio com cartões visuais por perfil.
- Resumo de valor previsto, quantidade de anúncios e perfis alcançados.

## Entrega v0.9.0

- Redesign completo do menu Anúncios, inspirado no modelo visual aprovado.
- Painel lateral com detalhes do anúncio selecionado.
- Quatro estados por perfil: não publicado, publicado, pendente e removido.
- Data da publicação registrada por perfil.
- Alternância rápida de status clicando diretamente na célula.
- Indicadores superiores de anúncios, publicações, pendências, aparelhos sem anúncio e removidos.
- Barra de progresso visual por anúncio.
- Fotos dos aparelhos na matriz quando disponíveis.
- Carga de anúncios por perfil para identificar perfis fracos.
- Ciclo completo do anúncio: fotos, título, descrição, grupos, renovação, impulsionamento e venda.
- Duplicação de anúncio.
- Atalhos de teclado: Espaço, Enter, Ctrl+D e Delete.
- Painel lateral com perfis publicados e pendentes.

## Correção da v0.9.1

- Corrigida a página branca no menu Anúncios.
- A causa era a ausência da importação de `useEffect`, usado pelos atalhos de teclado do novo painel.
- Todas as funções e o layout da v0.9.0 foram mantidos.

## Entrega v1.0.0

- Redesign completo do módulo Anúncios.
- Substituição da tabela estreita por cartões horizontais responsivos.
- Uso muito melhor da largura da tela.
- Perfis exibidos como botões de status dentro de cada anúncio.
- Barra de progresso por anúncio.
- Editor simplificado com painel lateral.
- Aparelhos sem anúncio exibidos em cartões.
- Menos bordas e menos botões repetidos.
- Visual mais próximo de sistemas modernos como ClickUp, Notion e Monday.

## Correção da v1.0.1

- Corrigida a tela branca no menu Anúncios.
- Adicionada leitura defensiva para anúncios criados em versões anteriores.
- Publicações antigas ou incompletas agora são normalizadas automaticamente.
- Corrigida a função ausente do fluxo do anúncio.
- Corrigida a duplicação de anúncio diretamente pelos cartões.
- Dados inválidos de um anúncio não impedem mais a abertura de todo o menu.

## Entrega v1.1.0

- Menu Anúncios redesenhado novamente com foco em clareza.
- Tema escuro exclusivo no módulo de anúncios.
- Matriz compacta por aparelho, anúncio e perfil.
- Painel lateral de detalhes ao selecionar uma linha.
- Ações removidas da listagem principal e concentradas no painel lateral.
- Status clicável diretamente na matriz.
- Melhor aproveitamento horizontal e menos rolagem vertical.
- Editor e modelos mantidos em abas separadas.

## Entrega v1.2.0 — redesign visual completo

- Tema escuro aplicado a todo o sistema, não apenas ao menu Anúncios.
- Novo menu lateral inspirado no layout visual aprovado.
- Nova logomarca tipográfica BMCenter com símbolo em azul.
- Menu lateral com item ativo em azul, ícones e rolagem interna.
- Bloco de atalhos de teclado na parte inferior.
- Identificação do usuário Diego Moraes / Administrador.
- Nova barra superior com versão e indicador do usuário.
- Painéis, formulários, tabelas, cards, modais e botões redesenhados.
- Dashboard, Smartphones, Fornecedores, Peças, Vendas, Agenda, Relatórios e demais telas adaptados ao novo tema.
- Login também atualizado.
- Layout responsivo para notebooks, tablets e celulares.

## Correções visuais da v1.2.1

- Removidas as faixas brancas de Anúncios, Comprar peças e Operação.
- Corrigido o seletor global de cabeçalhos que alterava os cartões Kanban.
- Dashboard reorganizado em grade estável e alinhada.
- Tamanhos de fonte padronizados em títulos, tabelas, botões e formulários.
- Lista de Smartphones compactada e ações reorganizadas.
- Comprar peças ganhou cores, campos e totais proporcionais ao tema escuro.
- Operação recebeu colunas e cartões totalmente escuros.
- Área vazia branca no final do menu Anúncios removida.
- Tabelas e seletores harmonizados com o restante do sistema.

## Correção do Dashboard — v1.2.2

- Dashboard reconstruído com classes próprias para evitar conflito com estilos antigos.
- Dez indicadores alinhados em uma grade uniforme.
- Cartões com mesma altura e espaçamento.
- As áreas inferiores não encostam nem sobrepõem os indicadores.
- Prioridades e desempenho por perfil centralizados em duas colunas equilibradas.
- Novo painel de fluxo dos aparelhos.
- Layout responsivo em cinco, três, duas ou uma coluna conforme o tamanho da tela.

## Entrega v1.3.0

- Histórico completo de movimentações do estoque de peças.
- Entradas, saídas e ajustes manuais com motivo, custo, saldo anterior e saldo posterior.
- Recebimento e instalação de peças agora registram movimentações automaticamente.
- Filtro de baixo estoque.
- Venda com conta de recebimento, taxa da plataforma, custo de entrega e valor líquido.
- Histórico de vendas mostra bruto, taxas, líquido, custo e lucro real.
- Relatórios passam a considerar o valor líquido da venda.
- Renovação de anúncios por perfil com data programada e botão “Renovado hoje”.
- Nova Central de pendências com tarefas vencidas, anúncios para renovar, baixo estoque e aparelhos sem anúncio.
- Backup passa a incluir as movimentações do estoque.

## Entrega v1.4.0

- Novo menu Recebimentos.
- Controle de vendas recebidas, pendentes e parciais.
- Valor recebido, saldo a receber e data de vencimento.
- Alerta visual para recebimentos vencidos.
- Edição rápida do valor recebido.
- Botão para marcar uma venda como totalmente recebida.
- Resumo de recebimentos por conta bancária.
- Venda com canal, tipo de entrega, parcelas, telefone e cidade do comprador.
- Histórico de vendas com filtros por status de recebimento.
- Dashboard mostra o total a receber.
- Relatórios por canal de venda e conta bancária.

## Entrega v1.5.0

- Novo menu Configurações.
- Escolha quais menus aparecem ou ficam ocultos na barra lateral.
- Ocultar um menu não apaga dados e não desativa sua função.
- Botão para mostrar todos os menus.
- Botão para manter somente os menus essenciais.
- Preferências dos menus entram no backup e na restauração.
- Correção visual global de todas as janelas e modais.
- Novo aparelho, vendedor, fornecedor, conta, usuário, anúncio, venda e demais formulários agora usam o tema escuro.
- Campos, títulos, listas, seletores, botões e rodapés dos modais foram padronizados.
- Melhor contraste e legibilidade em todas as janelas.

## Correção da v1.5.1

- Corrigida a tela preta ao iniciar o sistema.
- O ícone `Settings`, usado no novo menu Configurações, agora está corretamente importado.
- Todas as funções e correções visuais da v1.5.0 foram mantidas.

## Grande entrega v2.0.0

### Central operacional
- Novo menu Hoje com tarefas automáticas por etapa.
- Alertas para aparelhos parados, tarefas vencidas, falta de fotos e falta de anúncio.
- Sino de notificações no topo com contador em tempo real.
- Central de pendências mantida como visão detalhada.

### Ficha completa do aparelho
- Nova ficha operacional acessada pelo botão Ficha.
- Abas Resumo, Operação, Fotos, Anúncios, Histórico e Observações.
- Indicador visual do ciclo completo: compra, diagnóstico, cotação, pedido, reparo, fotos, anúncios e venda.
- Alteração de status, prioridade e próxima ação dentro da ficha.
- Resumo de peças, fotos, anúncios e perfis publicados.
- Timeline completa do aparelho.
- Etiquetas editáveis na ficha.

### Fotos
- Definição da foto principal.
- Reorganização da ordem das fotos.
- Exclusão de fotos pela ficha.
- Visualização organizada em galeria.

### Pesquisa e perfis
- Nova Pesquisa global por aparelho, IMEI, serial, etiqueta, anúncio, vendedor e fornecedor.
- Novo Painel de perfis com anúncios publicados, vendas, valor vendido, tempo médio e última venda.
- Filtro de smartphones por etiqueta.

### Segurança
- Todas as funções anteriores foram mantidas.
- Configuração de menus inclui os novos módulos.
- Backup identificado como versão 2.0.0.

## Grande entrega v2.1.0

- Paleta de comandos global com Ctrl+K.
- Navegação rápida entre menus.
- Pesquisa rápida de smartphones e anúncios dentro da paleta.
- Página inicial configurável.
- Ponto de restauração automático ao abrir uma nova versão.
- Duplicação rápida de aparelho, sem copiar anúncios, fotos ou venda.
- Biblioteca independente de títulos e descrições.
- Gerador de anúncio combina aleatoriamente títulos e descrições cadastrados.
- Exportação CSV separada para smartphones, anúncios, peças e desempenho dos perfis.
- Backup inclui preferências, bibliotecas de anúncios e configurações gerais.

## Grande entrega v2.2.0

- Ações em lote para status, prioridade, etiquetas e próxima ação.
- Central de qualidade dos dados, com IMEI duplicado e cadastros incompletos.
- Central de renovações de anúncios com renovação coletiva.
- Inteligência de fornecedores e comparação de economia por peça.
- Dashboard com renovações vencidas e cadastros incompletos.

## Grande entrega v2.4.0

### Organização dos aparelhos
- Marcar aparelhos como favoritos.
- Filtro para mostrar somente favoritos.
- Salvar combinações de filtros como visões personalizadas.
- Arquivar aparelhos sem excluí-los.
- Restaurar ou excluir definitivamente aparelhos arquivados.

### Central de atividades
- Histórico global de todas as movimentações.
- Filtros por tipo, período e pesquisa.
- Classificação automática em cadastro, operação, peças, anúncios, venda e outros.

### Checklist personalizado
- Nova aba Checklist na ficha do aparelho.
- Inclusão de tarefas personalizadas.
- Marcar tarefas concluídas.
- Exclusão de tarefas individuais.

### Backup
- Visões salvas e novos dados incluídos nos backups.

## Grande entrega v3.0.0

### Interface profissional
- Novas cores de destaque selecionáveis.
- Modo compacto.
- Transições e acabamento visual refinado.
- Dashboard com widgets ativáveis e desativáveis.

### Ficha do aparelho
- Comentários internos com autor e data.
- Anexos de documentos, PDFs e imagens.
- Etiquetas com cores personalizadas.
- Checklist, fotos, anúncios e histórico mantidos na mesma ficha.

### Dashboard
- Widgets configuráveis.
- Novo painel de alertas operacionais.
- Configuração persistente no sistema.

### Agenda
- Calendário mensal visual.
- Lista lateral de compromissos.
- Edição rápida da próxima ação e data.

### Compatibilidade
- Todos os dados das versões anteriores foram preservados.
- Novos campos usam valores padrão quando ainda não existem.

## Grande entrega v3.1.0

- Personalização real de cor do sistema.
- Modo compacto funcional.
- Novo menu de metas operacionais mensais.
- Comentários internos na ficha dos aparelhos.
- Anexos de documentos, PDFs e imagens.
- Etiquetas com cores personalizadas.
- Agenda mensal em formato de calendário.
- Edição rápida dos compromissos.
- Backup incluindo metas e novos campos.

## Entrega v3.2.0

- Configuração global para ocultar ou exibir o código interno dos aparelhos.
- Quando ocultado, o código deixa de aparecer nas listas, fichas, janelas, Agenda, atividades, anúncios, pesquisas e demais áreas operacionais.
- O código continua salvo internamente e pode ser reativado a qualquer momento.
- A tela Smartphones ganhou a coluna “Perfis anunciados”.
- A nova coluna mostra todos os perfis do Facebook onde existe uma publicação ativa daquele aparelho.
- Quando não existe publicação ativa, aparece “Não anunciado”.

## Correção v3.2.1

- Corrigido o erro JSX na aba Checklist que impedia o sistema de iniciar.
- Adicionada a configuração global para ocultar ou exibir o código interno.
- Adicionada a coluna Perfis anunciados na tela Smartphones.

## Correção visual v3.2.2

- Menu lateral fixo em toda a altura da tela.
- Menu adaptável para ícones em telas intermediárias.
- Navegação horizontal em telas pequenas.
- Tabela Smartphones compacta e proporcional.
- Linhas menores, seletores reduzidos e perfis em chips compactos.
- Ações principais alinhadas.
- Ações secundárias agrupadas no menu de três pontos.
- Removida a duplicação de botões.


## Versão 4.0.0 — estrutura definitiva

- Sidebar fixa em toda a altura da janela.
- Conteúdo sempre inicia imediatamente abaixo do header.
- Removido o espaço vertical gigante entre menu e página.
- Header global único.
- Container de todas as páginas padronizado em até 1700 px.
- Notebook mantém menu completo em largura reduzida.
- Tablet usa menu somente com ícones.
- Celular usa navegação horizontal superior.
- Regras antigas de `.shell > aside` e `.shell > main` foram definitivamente sobrescritas.


## v4.1.0
- Sidebar reconstruída conforme o layout aprovado.
- Menu principal agrupado em cartão.
- Seção Central de dados separada.
- Atalhos removidos da lateral.
- Usuário fixo em cartão no rodapé.
- Destaque azul, espaçamento, tipografia e ícones padronizados.


## Correções v4.3.0

- Menu lateral reduzido para a proporção do layout aprovado.
- Logo, textos, ícones, espaços e cartão do usuário compactados.
- Rolagem restrita à lista de menus.
- Correção da tela preta de Smartphones.
- Inclusão das funções ausentes de favorito, duplicação e arquivamento.
- Inclusão do ícone Copy que estava ausente e causava erro de renderização.


## Correção v4.3.0
- Ações da tabela centralizadas e padronizadas em botões quadrados com ícones.
- Tabela sempre retorna ao início horizontal ao alterar filtros.
- Modo compacto agora reduz sidebar, cabeçalho, filtros, tabelas, botões e cards de forma perceptível.


## v4.3.0 — Smartphones personalizável

- Botões de ação maiores, visíveis e com cores diferentes por função.
- Nova opção “Editar colunas”.
- Reordenação das colunas por arrastar ou pelos botões laterais.
- Controle de largura em pixels, com botões + e −.
- Ocultar e reexibir qualquer coluna.
- Restaurar configuração padrão.
- Preferências de colunas salvas automaticamente no navegador.

## Personalização de tabelas v4.4.0

- Redimensionamento das colunas diretamente pela borda do cabeçalho, como no Excel.
- Reordenação por arrastar e soltar os títulos das colunas.
- Editor lateral para ocultar, exibir, ordenar e definir largura exata.
- Configurações salvas automaticamente e separadamente por tela/tabela.
- Recurso aplicado à tela Smartphones e às principais tabelas das demais páginas.
- Menu de três pontos da tela Smartphones agora abre acima da tabela, sem ser cortado.
- Cabeçalhos e valores numéricos centralizados de forma consistente.

## Aparência e colunas v4.5.0

- Todas as opções de aparência ficam dentro do menu principal Configurações.
- Temas rápidos e personalização completa de cores.
- Tema aplicado em páginas, sub-janelas, modais, tabelas, menus e formulários.
- Modos claro, escuro e automático.
- Colunas ajustáveis de 20 px até 1200 px.
- Duplo clique na borda ajusta automaticamente ao conteúdo, como no Excel.
- Recurso aplicado a Smartphones e às demais tabelas personalizáveis.

## v4.6.0
- Configurações profissionais por abas.
- Tema completo global.
- Colunas entre 12 px e 1600 px.
- Autofit por duplo clique revisado.

## Correção global v4.6.1

- Todos os modais e janelas de cadastro corrigidos pelo componente central.
- Novo aparelho, fornecedor, vendedor, conta bancária, venda, agenda, anúncios e demais janelas usam a mesma estrutura.
- Modal centralizado, sem corte lateral e limitado à altura da tela.
- Cabeçalho fixo, conteúdo com rolagem interna e rodapé de ações sempre acessível.
- Tema global aplicado também à sidebar, logomarca, menus, item ativo e cartão do usuário.
- Larguras das colunas realmente livres e duplo clique reforçado.

## v4.7.0

- Configurações reorganizadas em layout compacto e alinhado.
- Menus visíveis agora aparecem como chips compactos.
- Aparência com menos espaços vazios e controles menores.
- Menu Perfis virou um gerenciador completo dos perfis do Facebook.
- Criar, editar, excluir, ativar, desativar e ordenar perfis.
- Link do Facebook, cor de identificação e observações internas.
- Desempenho de cada perfil mantido em aba separada.

## Correção v4.7.1

- Removido o espaço vazio excessivo da aba Configurações > Aparência.
- Cards agora usam altura automática.
- Prévia do tema limitada e compacta.
- Aplicação global do tema posicionada logo após os painéis.
- Melhor alinhamento entre os dois lados da tela.


## v5.0.1 Cloud
- Supabase Auth e banco em nuvem.
- Sincronização automática entre computador e celular, com verificação contínua em poucos segundos.
- Migração automática do localStorage no primeiro acesso.
- Layout mobile com menu lateral em gaveta.
- Formulários e modais adaptados ao celular.
- Configuração pronta para Vercel.


## v5.0.1 — Mobile e sincronização
- Corrige o conteúdo deslocado para fora da tela no celular.
- Menu lateral vira gaveta móvel de verdade.
- Dashboard e cards ocupam 100% da largura do aparelho.
- Modais e formulários adaptados à tela móvel.
- Sincronização preserva a página atual e a posição da rolagem.


## v5.0.2 — Menu mobile

- Menu móvel reorganizado em uma única coluna.
- Nomes completos, sem reticências ou cortes.
- Central de dados posicionada abaixo do menu principal.
- Botão dedicado para fechar a gaveta.
- Logo, rolagem e rodapé do usuário ajustados para celular.
- Gaveta limitada a 88% da tela, com sobreposição correta.

## v5.0.3 — Exclusão completa de dados

- A função “Apagar todos os dados” agora remove os registros da conta no Supabase.
- Exclusão sincronizada com todos os dispositivos conectados.
- Marcador de redefinição impede que dados antigos sejam enviados novamente para a nuvem.
- Dupla confirmação antes da exclusão definitiva.
- Mensagem de processamento e tratamento de falhas.
- A sessão de login é preservada; apenas os dados operacionais são apagados.

## v5.1.0 — Estabilidade, backup integral e bancos

- Backup dinâmico de 100% das chaves do BMCenter.
- Fornecedores, contas bancárias, perfis, configurações, layouts e futuras funções incluídos automaticamente.
- Restauração integral sincronizada com o Supabase antes do recarregamento.
- Compatibilidade com backups legados em JSON.
- Prévia e resumo antes da restauração.
- Backups manuais em arquivo `.bmcenter`.
- Até 10 backups versionados armazenados na nuvem.
- Restaurar ou excluir backups diretamente pelo sistema.
- Contas Bancárias novamente visível no menu principal.

## v5.2.0 — Cadastro em massa e privacidade global

- Novo cadastro em massa de aparelhos na tela Smartphones.
- Dados compartilhados da compra: data, vendedor, fornecedor/pessoa, origem, pagamento e conta bancária.
- Quantidade livre de aparelhos no mesmo lote.
- Marca, modelo, cor, armazenamento, RAM, IMEI, serial, senha, valores, status, prioridade e observações individuais.
- Cada item é salvo separadamente e recebe código próprio.
- Campo “Senha do aparelho” também disponível no cadastro individual e na ficha.
- Ocultação do código interno reforçada em Anúncios, Ações em lote, Comprar peças, alertas, pesquisa e demais telas.
- Backup completo continua dinâmico e agora registra auditoria de tema, cores, colunas, layouts, menus e visualizações.

## v5.2.1 — Correção de regressão visual

- Corrigido botão “Colunas” sendo criado repetidamente em cada atualização da tabela.
- Apenas um botão de configuração por tabela no desktop.
- Botão flutuante de colunas ocultado no celular.
- Modal de personalização de colunas reorganizado e compactado.
- Menu mobile sempre abre no início da lista.
- Gaveta móvel com largura, rolagem e cabeçalho corrigidos.
- Tabelas confinadas em rolagem horizontal própria.
- Cadastro em massa, backup integral e demais funções da v5.2.0 preservados.

## v5.2.2 — Menu Smartphones restaurado

- O menu Smartphones passa a ser considerado essencial e não pode mais ser ocultado.
- Configurações antigas ou backups que tenham Smartphones desativado são corrigidos automaticamente.
- A sincronização na nuvem não consegue mais remover esse menu.
- A opção permanece visível nas configurações, marcada como “Essencial”.

## v5.3.0 — Edição enxuta

Removidos da interface: Prioridade e Planejamento, Agenda, Metas, Central de renovações, Arquivados, Pesquisa global/Ctrl+K, Vendedores, Vendedor da compra, Fornecedor da compra, Acessórios e Controle de fotos.

O cadastro em massa foi simplificado da mesma forma. A galeria de arquivos de fotos continua disponível; somente o checklist/controle de fotos foi removido.

PC e celular agora renderizam o menu a partir da mesma lista. Smartphones é essencial e permanece sempre disponível.

## v5.3.1 — Hotfix da inicialização

- Corrigida a tela preta causada pela leitura de `removedPages` antes da inicialização.
- Mantida integralmente a interface enxuta da v5.3.0.
- Smartphones continua obrigatório no menu de PC e celular.

## v5.3.2 — Correção definitiva da tela preta

- Pontos de restauração automáticos não incluem mais o próprio histórico de snapshots.
- Corrigido crescimento recursivo que podia estourar o LocalStorage após sincronização.
- Snapshots antigos são compactados/reparados automaticamente.
- Auto snapshot nunca mais pode derrubar a interface.
- Tela de recuperação substitui a tela preta caso outro erro de dados aconteça.
- Pontos de restauração usam o novo formato de backup corretamente.
- Removido bloco residual de relatório de vendedores que poderia causar erro ao abrir Relatórios.

## v5.4.0 — Modern Compact UI

- Reforma visual global sem alteração das regras de negócio.
- Tipografia, botões, campos, cards e espaçamentos reduzidos e padronizados.
- Tabelas mais densas e profissionais.
- Página de Anúncios redesenhada para aproveitar melhor a tela.
- Indicadores, tabela, painel lateral e editor de anúncios compactados.
- Modal Novo/Editar aparelho reduzido e reorganizado.
- Formulário de aparelho usa quatro colunas no desktop, duas no celular largo e uma em telas estreitas.
- Modais genéricos também foram reduzidos.
- Sidebar, filtros, tabs e painéis seguem a nova escala visual.
- Responsividade mobile preserva área mínima de toque.

## v5.5.0 — Modern UI

- Página de Anúncios deixa de usar matriz/tabela como visão principal.
- Cada anúncio agora é um card horizontal com aparelho, canais, status, progresso e ações.
- Status de publicação continua editável diretamente clicando no canal.
- Indicador de progresso circular.
- Aparelhos sem anúncio viram uma barra discreta e um drawer lateral.
- Painel de detalhes do anúncio preservado.
- Editor, Modelos e Biblioteca preservados.
- Tabelas do restante do sistema passam a ter aparência de linhas/cards, com menos grades e divisórias.
- Painéis, formulários, modais, configurações e métricas recebem identidade visual unificada.
- Responsividade adaptada para desktop, tablet e celular.

## v5.6.0 — Premium Product UI

- Redesign visual profundo do BMCenter.
- Página de Anúncios reconstruída para seguir o mock aprovado: cabeçalho, cinco métricas, busca/filtros, cards largos por anúncio, canais em lista, progresso circular e ações.
- Cards de anúncio com proporções maiores, tipografia legível e superfícies neutras.
- Ações em lote recebeu visual de lista operacional em vez de grade pesada.
- Peças e acessórios usa cartões por fornecedor com tabelas visualmente leves.
- Relatórios recebeu métricas maiores, rankings e painéis de analytics.
- Sidebar, topbar, botões, campos, modais, configurações e painéis agora seguem o mesmo design system.
- Personalização de colunas deixa de repetir botões dentro de cada tabela; um único controle é mostrado por página.
- Layout responsivo revisado para desktop, tablet e celular.

## v5.7.0 — Reconstrução estrutural da interface

- Smartphones deixou de usar tabela como visão principal; agora usa cards reais por aparelho.
- Ações em lote deixou de usar tabela e virou lista selecionável em cards.
- Peças e acessórios deixou de usar tabelas como interface principal; agora utiliza grupos e linhas de ação em cards.
- Fornecedores e contas bancárias foram reconstruídos como cards de entidade.
- Anúncios recebeu cabeçalho e resumo simplificados e cards ajustados ao modelo visual aprovado.
- Perfis e Relatórios foram integrados ao mesmo design system.
- A configuração de exibição de Smartphones continua funcionando, agora controlando informações dos cards.
- Toda a lógica funcional existente foi preservada.


## v5.8.0 — camada visual final
- CSS novo carregado depois de todos os estilos antigos.
- Smartphones em grid de cards no desktop.
- Anúncios com cards maiores e canais organizados.
- Ações em lote, fornecedores, contas e peças com visual de cards.
- Versão 5.8.0 visível no topo.


## v5.8.1 — correção de build
- Corrigida a função Parts() que estava truncada e impedia o build na Vercel.
- Build local validado antes da entrega.


## v5.9.0 — Calm UI
- Reforma visual global para reduzir aparência de planilha.
- Cards compactos em Smartphones, Anúncios e Ações em lote.
- Dashboard, Hoje, Atividades, Fornecedores, Contas, Peças, Qualidade, Relatórios, Configurações e modais seguem a mesma linguagem visual.
- Anúncios em grade de dois cards por linha no desktop.
- Ações em lote em três cards compactos por linha no desktop.
- Smartphones em três cards por linha no desktop.
- Menos bordas, menos altura, mais respiro e hierarquia.
- Formulário Novo aparelho reduzido e organizado em quatro colunas no desktop.

## v5.10.0

- Menu de três pontos de Smartphones agora fica dentro do próprio card e acompanha a rolagem.
- Botões Exibição, Cadastro em massa e Novo aparelho aproveitam a largura no mobile.
- Anúncios recebeu nova estrutura de cards compactos: dados, progresso e perfis sem barras gigantes.
- Ações em lote usa cards menores em grade.
- Controles e filtros mobile foram compactados para aproveitar melhor a tela.
- Redução global de espaçamentos e aparência de grade/planilha.

## v6.0.0 — Premium UI

Reconstrução visual do sistema com novo design system:
- Smartphones em cards compactos premium.
- Anúncios em cards modernos, sem matriz/tabela como visão principal.
- Ações em lote em grade compacta.
- Botões, filtros, modais e formulários reorganizados.
- Mobile com layouts próprios e melhor aproveitamento horizontal.
- Menos bordas, menos blocos gigantes e menos aparência de ERP/tabela.
- Mantida a lógica funcional, Supabase, sincronização e backup.

## v6.0.1

- Corrigido encoding do PUBLICAR-ATUALIZACAO.bat para Windows CMD, sem BOM UTF-8.

## v6.1.0

Nova composição visual: shell, navegação, Smartphones, Anúncios e Ações em lote reconstruídos; demais módulos recebem o mesmo design system.

## v6.1.1

- Publicador BAT refeito para Windows.
- npm install não interrompe mais o fluxo por código de retorno inconsistente; a presença do Vite e o build são a validação real.
- Mensagens de erro separadas por etapa.

## v6.1.2

- Corrigido erro JSX na navegação lateral (`primaryMenuIds.map` e `dataMenuIds.map`) que impedia o Vite de compilar.

## v6.2.0 — Componentização real da interface

- Criados componentes compartilhados em `src/components/ui`.
- Criadas views separadas em `src/pages` para Smartphones, Anúncios e Ações em lote.
- O `main.jsx` mantém a lógica e passa dados/ações para essas views.
- Novo CSS isolado `v62.css`, carregado por último, referente apenas aos novos componentes.

## v7.0.0 — Nova identidade visual

Esta versão abandona a evolução visual da linha 6.x e cria uma nova interface global:
- novo AppFrame;
- nova sidebar;
- novo topbar;
- novo canvas;
- nova hierarquia visual;
- Smartphones em cards horizontais;
- Anúncios em cards editoriais;
- Ações em lote em mini-cards;
- novo padrão para Dashboard, Hoje, Fornecedores, Contas, Perfis, Peças, Qualidade e Relatórios;
- novos modais e formulários;
- nova composição mobile.

## v8.0.0 — Reconstrução visual

Nova aparência baseada em módulos com composições diferentes:
- novo rail de navegação compacto;
- nova command bar;
- Dashboard em bento;
- Hoje em fila de foco;
- Smartphones como feed de inventário;
- Anúncios como central de publicação;
- Ações em lote como inbox de seleção;
- novo padrão visual para fornecedores, contas, perfis, peças, qualidade e relatórios;
- modais e formulários reestilizados;
- mobile adaptado.

## v8.0.1

- Corrigido fechamento da função Dashboard que causava `Unexpected end of file` no build.

## v8.0.2
- Sidebar ampliada para 190px no desktop.
- Nomes dos menus passam a aparecer por extenso.
- Removida rolagem horizontal da navegação.
- Scroll vertical preservado apenas quando necessário.
- Ajustado comportamento do menu no mobile.

## v8.0.3
- Barra de rolagem lateral quase invisível.
- Trilho removido.
- Indicador fino aparece apenas ao passar o mouse sobre o menu.
- Container externo da sidebar sem scrollbar visível.

## v8.0.4 — correção definitiva do número da versão

- Criado `APP_VERSION` como fonte única de versão.
- O selo no topo passa a usar `APP_VERSION`.
- O snapshot automático passa a usar a mesma versão.
- Evita divergência entre `package.json` e a versão exibida na interface.

## v8.0.5 — acabamento visual + Aparência funcional

- Removidos blocos brancos residuais de Dashboard, Hoje, Smartphones, Anúncios, Perfis, Backup e Configurações.
- Cabeçalhos, captions, estados vazios e cartões passam a respeitar o dark premium aprovado.
- Fonte do menu lateral aumentada discretamente.
- Configurações > Aparência agora controla de verdade as variáveis visuais da interface V8.
- Cores primária/secundária/destaque, fundos, cards, texto, bordas, raio, densidade e transições passam a refletir imediatamente.
- Modo claro/escuro conectado ao AppFrame V8.

## v8.0.6 — legibilidade, temas e Personalizado

- Eliminados os últimos cabeçalhos brancos da Dashboard e regras defensivas para módulos legados.
- Fonte do menu lateral aumentada discretamente.
- Tipografia de Smartphones, Anúncios, Hoje, Dashboard e demais módulos aumentada globalmente.
- Novos temas: Grafite, Oceano, Índigo, Floresta e Vinho.
- Editor Personalizado agora usa um rascunho de cores próprio e botão “Aplicar personalizado”.
- Campos HEX incompletos não quebram mais o tema enquanto estão sendo digitados.

## v8.0.7 — Tema Equilíbrio

- Novo tema padrão Equilíbrio, aplicado automaticamente uma única vez nesta versão.
- Paleta neutra escura, com menos saturação e maior foco em leitura.
- Azul suave restrito a ações e navegação.
- Verde/vermelho usados apenas como cores semânticas.
- Cabeçalhos, tabelas, filtros, cards e Dashboard neutralizados.
- Gradientes decorativos e excesso de superfícies azuis reduzidos.
- Restaurar padrões agora retorna ao tema Equilíbrio.

## v9.0.0 — Redesign completo

- Nova interface AppFrameV9.
- Sidebar larga e legível com agrupamento de menus.
- Apenas dois temas: Claro e Escuro.
- Nova Dashboard.
- Nova página Hoje em fluxo vertical.
- Smartphones redesenhado como catálogo em cards.
- Anúncios redesenhado como cards de publicação.
- Ações em lote redesenhado.
- Padrão visual V9 aplicado aos módulos legados, tabelas, formulários e modais.
- Tipografia e contraste aumentados para leitura.
