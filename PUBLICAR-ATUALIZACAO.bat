@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

title BMCenter Smartphones v10.5.40 - Publicar Atualizacao

set "REPO=https://github.com/diegobmcenter/BMCenter-Smartphones.git"
set "BRANCH=main"
set "VERSION=10.5.40"

echo.
echo ============================================================
echo       BMCENTER SMARTPHONES v%VERSION% - PUBLICACAO
echo ============================================================
echo.

echo [1/9] Verificando Node, NPM e Git...
where.exe node >nul 2>&1
if errorlevel 1 goto :node_error
where.exe npm.cmd >nul 2>&1
if errorlevel 1 goto :node_error
where.exe git >nul 2>&1
if errorlevel 1 goto :git_error

echo [2/9] Instalando dependencias...
call npm.cmd install --no-audit --no-fund
if errorlevel 1 goto :install_error

echo [3/9] Executando testes do sistema...
call npm.cmd run test:parts-orders
if errorlevel 1 goto :test_error

echo [4/9] Compilando a versao...
call npm.cmd run build
if errorlevel 1 goto :build_error

echo.
echo ============================================================
echo                     BUILD APROVADO
echo ============================================================
echo.

if not exist ".git" (
  echo [5/9] Inicializando repositorio local...
  git init
  if errorlevel 1 goto :git_operation_error
) else (
  echo [5/9] Repositorio Git encontrado.
)

git branch -M %BRANCH% >nul 2>&1

git remote get-url origin >nul 2>&1
if errorlevel 1 (
  git remote add origin "%REPO%"
) else (
  git remote set-url origin "%REPO%"
)

echo [6/9] Sincronizando historico do GitHub sem sobrescrever esta versao...
git fetch origin %BRANCH%
if errorlevel 1 goto :fetch_error
git reset --mixed origin/%BRANCH%
if errorlevel 1 goto :git_operation_error

echo [7/9] Limpando arquivos gerados que nunca devem ir ao GitHub...
git rm -r --cached --ignore-unmatch node_modules >nul 2>&1
git rm -r --cached --ignore-unmatch dist >nul 2>&1
git rm -r --cached --ignore-unmatch .vercel >nul 2>&1

if not exist ".gitignore" goto :gitignore_error

git config user.name >nul 2>&1
if errorlevel 1 git config user.name "Diego Moraes"
git config user.email >nul 2>&1
if errorlevel 1 git config user.email "diegobmcenter@users.noreply.github.com"

echo [8/9] Criando e enviando a atualizacao...
git add -A
if errorlevel 1 goto :git_operation_error

git diff --cached --quiet
if not errorlevel 1 goto :no_changes

git commit -m "BMCenter v10.5.33 - corrige contrato dos filtros e mantem passada fina"
if errorlevel 1 goto :git_operation_error

git push origin %BRANCH%
if errorlevel 1 goto :push_error

echo [9/9] Confirmando que o GitHub recebeu exatamente este commit...
for /f "tokens=1" %%H in ('git rev-parse HEAD') do set "LOCAL_SHA=%%H"
for /f "tokens=1" %%H in ('git ls-remote origin refs/heads/%BRANCH%') do set "REMOTE_SHA=%%H"
if not defined LOCAL_SHA goto :verify_error
if not defined REMOTE_SHA goto :verify_error
if /I not "%LOCAL_SHA%"=="%REMOTE_SHA%" goto :verify_error

echo.
echo ============================================================
echo                 ATUALIZACAO ENVIADA COM SUCESSO
echo ============================================================
echo GitHub confirmou a v%VERSION% na branch %BRANCH%.
echo Commit: %LOCAL_SHA%
echo.
echo A Vercel fara o deploy automaticamente a partir deste commit.
echo IMPORTANTE: esta mensagem confirma o GitHub. Se a Vercel falhar,
echo o site continuara mostrando a versao anterior ate o deploy ser corrigido.
echo.
pause
exit /b 0

:no_changes
echo.
echo Nenhuma alteracao nova foi encontrada para publicar.
for /f "tokens=1" %%H in ('git rev-parse HEAD') do set "LOCAL_SHA=%%H"
for /f "tokens=1" %%H in ('git ls-remote origin refs/heads/%BRANCH%') do set "REMOTE_SHA=%%H"
if defined LOCAL_SHA if defined REMOTE_SHA if /I "%LOCAL_SHA%"=="%REMOTE_SHA%" (
  echo O GitHub ja possui exatamente este commit.
) else (
  echo AVISO: nao foi possivel confirmar que o GitHub possui este commit.
)
echo.
pause
exit /b 0

:node_error
echo.
echo ERRO: Node.js ou NPM nao foi encontrado no PATH.
echo Feche esta janela, abra um novo Prompt de Comando e teste: node -v e npm -v
goto :failed

:git_error
echo.
echo ERRO: Git nao foi encontrado no PATH.
goto :failed

:install_error
echo.
echo ERRO: npm install falhou. Nada foi publicado.
goto :failed

:test_error
echo.
echo ERRO: os testes do sistema falharam. Nada foi publicado.
goto :failed

:build_error
echo.
echo ERRO: npm run build falhou. Nada foi publicado.
goto :failed

:fetch_error
echo.
echo ERRO: nao foi possivel consultar o GitHub. Nada foi publicado.
goto :failed

:gitignore_error
echo.
echo ERRO: o arquivo .gitignore nao existe neste pacote.
echo Publicacao cancelada para impedir envio de node_modules ou dist.
goto :failed

:git_operation_error
echo.
echo ERRO: uma operacao do Git falhou. Nada foi publicado.
goto :failed

:push_error
echo.
echo ERRO: nao foi possivel enviar ao GitHub.
goto :failed

:verify_error
echo.
echo ERRO: o push terminou, mas nao foi possivel confirmar o mesmo commit na branch %BRANCH%.
echo Nao considere a atualizacao publicada ate esta verificacao passar.
goto :failed

:failed
echo.
echo ============================================================
echo                   PUBLICACAO CANCELADA
echo ============================================================
echo.
pause
exit /b 1
