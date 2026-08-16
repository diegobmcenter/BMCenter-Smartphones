@echo off
setlocal EnableExtensions
cd /d "%~dp0"

title BMCenter Smartphones v10.4.87 - Publicar Atualizacao

set "REPO=https://github.com/diegobmcenter/BMCenter-Smartphones.git"
set "BRANCH=main"
set "VERSION=10.4.87"

echo.
echo ============================================================
echo       BMCENTER SMARTPHONES v%VERSION% - PUBLICACAO
echo ============================================================
echo.

echo [1/8] Verificando Node, NPM e Git...
where.exe node >nul 2>&1
if errorlevel 1 goto :node_error
where.exe npm.cmd >nul 2>&1
if errorlevel 1 goto :node_error
where.exe git >nul 2>&1
if errorlevel 1 goto :git_error

echo [2/8] Instalando dependencias...
call npm.cmd install --no-audit --no-fund
if errorlevel 1 goto :install_error

echo [3/8] Testando pedidos de pecas...
call npm.cmd run test:parts-orders
if errorlevel 1 goto :test_error

echo [4/8] Compilando a versao...
call npm.cmd run build
if errorlevel 1 goto :build_error

echo.
echo ============================================================
echo                     BUILD APROVADO
echo ============================================================
echo.

if not exist ".git" (
  echo [5/8] Inicializando repositorio local...
  git init
  if errorlevel 1 goto :git_operation_error
) else (
  echo [5/8] Repositorio Git encontrado.
)

git branch -M %BRANCH% >nul 2>&1

git remote get-url origin >nul 2>&1
if errorlevel 1 (
  git remote add origin "%REPO%"
) else (
  git remote set-url origin "%REPO%"
)

echo [6/8] Sincronizando historico do GitHub sem sobrescrever esta versao...
git fetch origin %BRANCH%
if errorlevel 1 goto :fetch_error
git reset --mixed origin/%BRANCH%
if errorlevel 1 goto :git_operation_error

git config user.name >nul 2>&1
if errorlevel 1 git config user.name "Diego Moraes"
git config user.email >nul 2>&1
if errorlevel 1 git config user.email "diegobmcenter@users.noreply.github.com"

echo [7/8] Criando a atualizacao...
git add -A
if errorlevel 1 goto :git_operation_error
git diff --cached --quiet
if not errorlevel 1 goto :no_changes
git commit -m "BMCenter v10.4.87 - pre preencher valor recuperado da peca"
if errorlevel 1 goto :git_operation_error

echo [8/8] Enviando ao GitHub...
git push origin %BRANCH%
if errorlevel 1 goto :push_error

echo.
echo ============================================================
echo                 ATUALIZACAO PUBLICADA
echo ============================================================
echo GitHub recebeu a v%VERSION%.
echo A Vercel fara o deploy automaticamente.
echo.
pause
exit /b 0

:no_changes
echo.
echo Nenhuma alteracao nova foi encontrada para publicar.
echo A compilacao e os testes passaram normalmente.
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
echo ERRO: os testes de pedidos de pecas falharam. Nada foi publicado.
goto :failed

:build_error
echo.
echo ERRO: npm run build falhou. Nada foi publicado.
goto :failed

:fetch_error
echo.
echo ERRO: nao foi possivel consultar o GitHub. Nada foi publicado.
goto :failed

:git_operation_error
echo.
echo ERRO: uma operacao do Git falhou. Nada foi publicado.
goto :failed

:push_error
echo.
echo ERRO: nao foi possivel enviar ao GitHub.
goto :failed

:failed
echo.
echo Copie a mensagem acima se precisar de ajuda.
echo.
pause
exit /b 1
