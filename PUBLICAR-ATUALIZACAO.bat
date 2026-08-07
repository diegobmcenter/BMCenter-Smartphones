@echo off
setlocal EnableExtensions
chcp 65001 >nul
title BMCenter Smartphones - Publicar Atualizacao

cd /d "%~dp0"

set "REPO=https://github.com/diegobmcenter/BMCenter-Smartphones.git"
set "BRANCH=main"

echo.
echo ============================================================
echo        BMCenter Smartphones - PUBLICAR ATUALIZACAO
echo ============================================================
echo.
echo Pasta da versao:
echo %CD%
echo.
echo Este processo vai enviar ESTA pasta diretamente ao GitHub.
echo A Vercel publicara a nova versao automaticamente.
echo.
pause

where git >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERRO] Git nao foi encontrado neste computador.
    echo Instale o Git for Windows e tente novamente.
    echo.
    pause
    exit /b 1
)

echo.
echo [1/6] Preparando repositorio...

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

echo [2/6] Buscando a versao atual do GitHub...
git fetch origin %BRANCH%
if errorlevel 1 goto :erro

echo [3/6] Ligando esta pasta ao historico do projeto...
git symbolic-ref HEAD refs/heads/%BRANCH%
git reset --mixed origin/%BRANCH%
if errorlevel 1 goto :erro

echo [4/6] Preparando os arquivos da nova versao...
git add -A
if errorlevel 1 goto :erro

git diff --cached --quiet
if not errorlevel 1 (
    echo.
    echo Nenhuma alteracao nova foi encontrada.
    echo Esta versao parece ja estar publicada.
    echo.
    pause
    exit /b 0
)

git config user.name >nul 2>&1
if errorlevel 1 git config user.name "BMCenter Updater"

git config user.email >nul 2>&1
if errorlevel 1 git config user.email "diegobmcenter@users.noreply.github.com"

echo [5/6] Criando a atualizacao...
git commit -m "BMCenter - publicar nova versao"
if errorlevel 1 goto :erro

echo [6/6] Enviando para o GitHub...
git push -u origin %BRANCH%
if errorlevel 1 goto :erro

echo.
echo ============================================================
echo          ATUALIZACAO ENVIADA COM SUCESSO!
echo ============================================================
echo.
echo O GitHub recebeu a nova versao.
echo A Vercel deve iniciar o deploy automaticamente.
echo Aguarde alguns instantes e atualize o BMCenter no navegador.
echo.
pause
exit /b 0

:erro
echo.
echo ============================================================
echo       NAO FOI POSSIVEL PUBLICAR A ATUALIZACAO
echo ============================================================
echo.
echo Leia a mensagem de erro acima.
echo Nenhum dado do Supabase foi apagado por este processo.
echo.
pause
exit /b 1
