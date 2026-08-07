@echo off
setlocal EnableExtensions
title BMCenter Smartphones - Publicar Atualizacao
cd /d "%~dp0"

set "REPO=https://github.com/diegobmcenter/BMCenter-Smartphones.git"
set "BRANCH=main"

echo.
echo ============================================================
echo     BMCenter Smartphones - PUBLICAR ATUALIZACAO
echo ============================================================
echo.
echo Pasta:
echo %CD%
echo.
pause

where git >nul 2>&1
if errorlevel 1 goto :git_error

where npm >nul 2>&1
if errorlevel 1 goto :npm_missing

echo.
echo [1/8] Verificando dependencias...

if not exist "node_modules\vite\bin\vite.js" (
    echo Dependencias ainda nao instaladas. Instalando...
    call npm install --no-audit --no-fund
)

if not exist "node_modules\vite\bin\vite.js" goto :install_error

echo Dependencias OK.

echo.
echo [2/8] Testando a versao antes de publicar...
call npm run build
if errorlevel 1 goto :build_error

echo.
echo ============================================================
echo                   BUILD APROVADO
echo ============================================================
echo.

echo [3/8] Preparando repositorio...
if not exist ".git" (
    git init
    if errorlevel 1 goto :git_operation_error
)

git branch -M %BRANCH% >nul 2>&1

git remote get-url origin >nul 2>&1
if errorlevel 1 (
    git remote add origin "%REPO%"
) else (
    git remote set-url origin "%REPO%"
)

echo [4/8] Buscando a versao atual do GitHub...
git fetch origin %BRANCH%
if errorlevel 1 goto :git_operation_error

echo [5/8] Sincronizando o historico...
git symbolic-ref HEAD refs/heads/%BRANCH%
git reset --mixed origin/%BRANCH%
if errorlevel 1 goto :git_operation_error

echo [6/8] Preparando os arquivos...
git add -A
if errorlevel 1 goto :git_operation_error

git diff --cached --quiet
if not errorlevel 1 goto :nothing_to_publish

git config user.name >nul 2>&1
if errorlevel 1 git config user.name "BMCenter Updater"
git config user.email >nul 2>&1
if errorlevel 1 git config user.email "diegobmcenter@users.noreply.github.com"

echo [7/8] Criando a atualizacao...
git commit -m "BMCenter v8.0.7 - correcao do publicador"
if errorlevel 1 goto :git_operation_error

echo [8/8] Enviando ao GitHub...
git push -u origin %BRANCH%
if errorlevel 1 goto :push_error

echo.
echo ============================================================
echo          ATUALIZACAO ENVIADA COM SUCESSO!
echo ============================================================
echo.
echo O GitHub recebeu os arquivos.
echo A Vercel deve iniciar o deploy automaticamente.
echo.
pause
exit /b 0

:nothing_to_publish
echo.
echo ============================================================
echo            NENHUMA ALTERACAO PARA PUBLICAR
echo ============================================================
echo.
echo Os arquivos desta pasta ja estao iguais aos do GitHub.
echo.
pause
exit /b 0

:git_error
echo.
echo [ERRO] Git nao foi encontrado neste computador.
echo.
pause
exit /b 1

:npm_missing
echo.
echo [ERRO] Node.js / NPM nao foi encontrado neste computador.
echo.
pause
exit /b 1

:install_error
echo.
echo ============================================================
echo          ERRO AO INSTALAR AS DEPENDENCIAS
echo ============================================================
echo.
echo O arquivo node_modules\vite\bin\vite.js nao foi encontrado.
echo Copie ou fotografe as ultimas mensagens acima.
echo.
pause
exit /b 1

:build_error
echo.
echo ============================================================
echo                 O BUILD FALHOU
echo ============================================================
echo.
echo Nada foi enviado para o GitHub.
echo Copie ou fotografe o erro que apareceu acima.
echo.
pause
exit /b 1

:push_error
echo.
echo ============================================================
echo               O ENVIO AO GITHUB FALHOU
echo ============================================================
echo.
echo O build passou, mas o GitHub recusou o envio.
echo Copie ou fotografe a mensagem acima.
echo.
pause
exit /b 1

:git_operation_error
echo.
echo ============================================================
echo             ERRO DURANTE A ETAPA DO GIT
echo ============================================================
echo.
echo Copie ou fotografe a mensagem que apareceu acima.
echo.
pause
exit /b 1
