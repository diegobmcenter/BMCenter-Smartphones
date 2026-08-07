@echo off
setlocal EnableExtensions
chcp 65001 >nul
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
 echo [ERRO] Git nao encontrado.
 pause
 exit /b 1
)
where npm >nul 2>&1
if errorlevel 1 (
 echo [ERRO] NPM/Node.js nao encontrado.
 pause
 exit /b 1
)

echo.
echo [1/8] Instalando/verificando dependencias...
call npm install
if errorlevel 1 goto :build_error

echo.
echo [2/8] Testando compilacao da versao...
call npm run build
if errorlevel 1 goto :build_error

echo.
echo ============================================================
echo   BUILD APROVADO - agora a versao pode ser publicada.
echo ============================================================
echo.

if not exist ".git" (
 echo [3/8] Criando repositorio local...
 git init
 if errorlevel 1 goto :erro
) else (
 echo [3/8] Repositorio local encontrado.
)

git branch -M %BRANCH% >nul 2>&1
git remote get-url origin >nul 2>&1
if errorlevel 1 (git remote add origin "%REPO%") else (git remote set-url origin "%REPO%")

echo [4/8] Buscando a versao atual do GitHub...
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
 pause
 exit /b 0
)

git config user.name >nul 2>&1
if errorlevel 1 git config user.name "BMCenter Updater"
git config user.email >nul 2>&1
if errorlevel 1 git config user.email "diegobmcenter@users.noreply.github.com"

echo [7/8] Criando commit...
git commit -m "BMCenter v5.9.0 - Calm UI"
if errorlevel 1 goto :erro

echo [8/8] Enviando para o GitHub...
git push -u origin %BRANCH%
if errorlevel 1 goto :erro

echo.
echo ============================================================
echo   ATUALIZACAO VALIDADA E ENVIADA COM SUCESSO!
echo ============================================================
echo.
echo A Vercel deve iniciar um novo deploy automaticamente.
pause
exit /b 0

:build_error
echo.
echo ============================================================
echo   BUILD FALHOU - A ATUALIZACAO NAO FOI PUBLICADA
echo ============================================================
echo.
echo Copie a mensagem de erro acima e envie ao ChatGPT.
echo Nenhum arquivo foi enviado ao GitHub.
pause
exit /b 1

:erro
echo.
echo ============================================================
echo   ERRO DURANTE A PUBLICACAO
echo ============================================================
echo.
echo Leia a mensagem acima. O build havia sido aprovado,
echo mas ocorreu uma falha no Git/GitHub.
pause
exit /b 1
