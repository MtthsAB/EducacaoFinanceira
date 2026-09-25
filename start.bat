@echo off
setlocal
cd /d "%~dp0"

set "PORT=8080"
if not "%~1"=="" set "PORT=%~1"

echo.
echo  ===========================================
echo    Preciso ou quero?  -  servidor local
echo  ===========================================
echo.

rem ---- 1. Node instalado? ----
where node >nul 2>nul
if errorlevel 1 (
  echo  [ERRO] Node.js nao encontrado.
  echo.
  echo  Instale o Node.js LTS em https://nodejs.org/pt-br
  echo  e rode este arquivo de novo.
  echo.
  pause
  exit /b 1
)

for /f "delims=" %%v in ('node -v') do set "NODEVER=%%v"
echo  Node.js %NODEVER% encontrado.
echo.

rem ---- 2. Dependencias ----
if exist "node_modules\serve\package.json" (
  echo  Dependencias ja instaladas.
) else (
  echo  Instalando dependencias ^(npm install^)...
  echo.
  call npm install --no-audit --no-fund
  echo.
  if exist "node_modules\serve\package.json" (
    echo  Dependencias instaladas.
  ) else (
    echo  [AVISO] Nao deu para instalar o pacote "serve".
    echo          Sem problema: o servidor embutido nao precisa dele.
  )
)

rem ---- 3. Sobe o servidor ----
rem O serve.js procura uma porta livre, abre o navegador sozinho depois que
rem ja esta ouvindo, e fica rodando ate voce apertar Ctrl+C.
node serve.js site %PORT%
set "RC=%errorlevel%"

echo.
if not "%RC%"=="0" (
  echo  [ERRO] O servidor terminou com codigo %RC%.
  echo.
  echo  Tente rodar o comando abaixo nesta pasta para ver a mensagem completa:
  echo      node serve.js site %PORT%
) else (
  echo  Servidor encerrado.
)
echo.
pause
endlocal
