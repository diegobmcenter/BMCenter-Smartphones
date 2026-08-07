# Publicação simplificada

A partir desta versão, não é necessário copiar os arquivos para a antiga pasta v5.

## Forma mais simples

1. Extraia o ZIP da nova versão em qualquer pasta.
2. Abra a pasta extraída.
3. Dê dois cliques em `PUBLICAR-ATUALIZACAO.bat`.
4. Na primeira utilização, o GitHub poderá pedir autorização no navegador.
5. Aguarde a mensagem `ATUALIZACAO ENVIADA COM SUCESSO`.
6. A Vercel fará o deploy automaticamente a partir da branch `main`.

O arquivo `.env.local`, quando existente, não deve ser enviado ao GitHub e permanece protegido pelo `.gitignore`.

## Importante

O BAT publica os arquivos da própria pasta onde ele está. Não é necessário copiar a nova versão para uma pasta antiga.
