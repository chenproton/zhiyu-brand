@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

set REMOTE_HOST=47.251.48.187
set REMOTE_USER=root
set SITE_NAME=brand
set PORT=3004
set SSH_PORT=22
set REMOTE_DIR=/var/www/brand
set TAR_PATH=%TEMP%\brand-deploy.tar.gz
set "LOCAL_DIR=%~dp0"

if "!LOCAL_DIR:~-1!"=="\" set "LOCAL_DIR=!LOCAL_DIR:~0,-1!"

echo.
echo [Deploy] Next.js deploy script for Windows
echo    Target: %REMOTE_USER%@%REMOTE_HOST%:%SSH_PORT%
echo    Site: %SITE_NAME% (port %PORT%)
echo.

where ssh >nul 2>nul
if errorlevel 1 (
    echo [Error] ssh not found
    exit /b 1
)
where scp >nul 2>nul
if errorlevel 1 (
    echo [Error] scp not found
    exit /b 1
)

echo [1/4] Packing local code...
set "GIT_TAR=C:\Program Files\Git\usr\bin\tar.exe"
if exist "%TAR_PATH%" del /f "%TAR_PATH%"
if exist "%GIT_TAR%" (
    "%GIT_TAR%" -czf "%TAR_PATH%" --exclude=node_modules --exclude=.git --exclude=.next --exclude=*.log --exclude=.DS_Store -C "!LOCAL_DIR!" .
    echo        [OK] Packed
) else (
    echo [Error] Git tar not found, please install Git for Windows
    exit /b 1
)

echo.
echo [2/4] Uploading code to server...
echo        Please enter server password when prompted...
echo.

scp -o StrictHostKeyChecking=no -o ConnectTimeout=15 -P %SSH_PORT% "%TAR_PATH%" %REMOTE_USER%@%REMOTE_HOST%:/tmp/brand-deploy.tar.gz
if errorlevel 1 (
    echo.
    echo [Error] Upload failed, please check password and network
    exit /b 1
)

echo.
echo        [OK] Upload complete

echo.
echo [3/4] Uploading remote deploy script...
scp -o StrictHostKeyChecking=no -o ConnectTimeout=15 -P %SSH_PORT% "!LOCAL_DIR!\remote-deploy.sh" %REMOTE_USER%@%REMOTE_HOST%:/tmp/remote-deploy.sh

echo.
echo [4/4] Building and starting service on server...
echo        Please enter server password when prompted...
echo.

ssh -o StrictHostKeyChecking=no -o ConnectTimeout=15 -p %SSH_PORT% %REMOTE_USER%@%REMOTE_HOST% "bash /tmp/remote-deploy.sh"

if errorlevel 1 (
    echo.
    echo [Error] Remote deploy failed
    exit /b 1
)

echo.
echo [5/5] Checking service status...
timeout /t 2 /nobreak >nul
ssh -o StrictHostKeyChecking=no -p %SSH_PORT% %REMOTE_USER%@%REMOTE_HOST% "pm2 show %SITE_NAME% 2>/dev/null | grep -E 'name|status|memory|uptime' || echo 'Process not found'"

echo.
echo [OK] %SITE_NAME% deploy complete
echo    URL: http://%REMOTE_HOST%:%PORT%
echo.
echo Common commands:
echo    View logs: ssh %REMOTE_USER%@%REMOTE_HOST% "pm2 logs %SITE_NAME%"
echo    Restart:   ssh %REMOTE_USER%@%REMOTE_HOST% "pm2 restart %SITE_NAME%"
echo.
echo Done.

endlocal
