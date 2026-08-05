# Publicar o BMCenter v5.0.0 online

## 1. Criar o banco no Supabase
1. Crie um projeto em Supabase.
2. Abra SQL Editor e execute todo o arquivo `supabase-schema.sql`.
3. Em Authentication > Providers, mantenha Email habilitado.
4. Em Project Settings > API, copie Project URL e anon public key.

## 2. Variáveis de ambiente
Crie `.env.local` para testar localmente:
```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLICA
```
Nunca use a chave service_role no frontend.

## 3. Publicar na Vercel
1. Envie esta pasta para o GitHub.
2. Na Vercel, escolha Add New > Project e importe o repositório.
3. Framework: Vite. Build command: `npm run build`. Output: `dist`.
4. Cadastre as duas variáveis acima em Settings > Environment Variables.
5. Clique em Deploy.

## 4. Primeiro acesso e migração
- Crie uma conta na tela inicial.
- Confirme o e-mail, se solicitado.
- Entre no computador que contém seus dados atuais.
- Se a nuvem ainda estiver vazia, os dados locais serão enviados automaticamente.
- Depois, abra o mesmo endereço no celular e entre com a mesma conta.

## Sincronização
Cada alteração é salva no navegador e no Supabase. Alterações recebidas de outro dispositivo atualizam a sessão aberta automaticamente.
