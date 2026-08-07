@echo off
setlocal EnableExtensions
title BMCenter Smartphones - Publicar Atualizacao
cd /d "%~dp0"

set "REPO=https://github.com/diegobmcenter/BMCenter-Smartphones.git"
set "BRANCH=main"

echo.
echo ============================================================
echo   BMCenter Smartphones - VALIDAR E PUBLICAR ATUALIZACAO
echo ============================================================
echo.
echo Esta pasta sera validada antes de qualquer envio ao GitHub.
echo Se o build falhar, nada sera publicado.
echo.
pause

where git >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERRO] Git nao encontrado.
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERRO] NPM/Node.js nao encontrado.
    pause
    exit /b 1
)

echo.
echo [1/8] Instalando/verificando dependencias...
call npm install
if errorlevel 1 goto :erro

echo.
echo [2/8] Validando build de producao...
call npm run build
if errorlevel 1 goto :erro

echo.
echo BUILD APROVADO.
echo.

echo [3/8] Preparando repositorio Git...
if not exist ".git" (
    git init
    if errorlevel 1 goto :erro
)

git branch -M %BRANCH% >nul 2>&1

git remote get-url origin >nul 2>&1
if errorlevel 1 (
    git remote add origin "%REPO%"
) else (
    git remote set-url origin "%REPO%"
)

echo [4/8] Buscando versao atual do GitHub...
git fetch origin %BRANCH%
if errorlevel 1 goto :erro

echo [5/8] Ligando esta pasta ao historico do projeto...
git symbolic-ref HEAD refs/heads/%BRANCH%
git reset --mixed origin/%BRANCH%
if errorlevel 1 goto :erro

echo [6/8] Preparando arquivos...
git add -A
if errorlevel 1 goto :erro

git diff --cached --quiet
if not errorlevel 1 (
    echo.
    echo Nenhuma alteracao nova encontrada. Esta versao parece ja estar publicada.
    echo.
    pause
    exit /b 0
)

git config user.name >nul 2>&1
if errorlevel 1 git config user.name "BMCenter Updater"

git config user.email >nul 2>&1
if errorlevel 1 git config user.email "diegobmcenter@users.noreply.github.com"

echo [7/8] Criando commit...
git commit -m "BMCenter v6.0.1 - Premium UI"
if errorlevel 1 goto :erro

echo [8/8] Enviando para o GitHub...
git push -u origin %BRANCH%
if errorlevel 1 goto :erro

echo.
echo ============================================================
echo          ATUALIZACAO ENVIADA COM SUCESSO!
echo ============================================================
echo.
echo A Vercel deve iniciar o deploy automaticamente.
echo.
pause
exit /b 0

:erro
echo.
echo ============================================================
echo       ERRO - A ATUALIZACAO NAO FOI PUBLICADA
echo ============================================================
echo.
echo Leia a mensagem acima.
echo.
pause
exit /b 1
