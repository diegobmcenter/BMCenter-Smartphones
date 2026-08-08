# BMCenter v10.3.1 — Rascunhos de cadastro

## Cadastro individual
- Novo botão **Salvar e continuar depois**.
- O rascunho guarda todos os campos preenchidos do novo aparelho.
- Ao abrir **Novo aparelho** novamente, o rascunho é recuperado automaticamente.
- A tela informa a data/hora em que o rascunho foi salvo.
- É possível **Descartar rascunho** e começar novamente.
- Ao finalizar o cadastro, o rascunho é removido.

## Cadastro em massa
- Novo botão **Salvar e continuar depois**.
- Guarda dados compartilhados da compra e todos os aparelhos/linhas do lote.
- Quantidade de linhas, NFC, conector, valores, observações e desbloqueios são preservados.
- Ao abrir Cadastro em massa novamente, continua exatamente do estado salvo.
- É possível descartar o rascunho.
- Ao finalizar o lote, o rascunho é removido.

## Backup e nuvem
- `bmcenter-phone-draft` e `bmcenter-batch-phone-draft` usam o mesmo namespace persistente do BMCenter.
- Ambos entram automaticamente no backup completo v4.
- Ambos foram adicionados à sincronização de estado da nuvem.
- A auditoria do backup agora informa explicitamente se havia rascunhos capturados.
