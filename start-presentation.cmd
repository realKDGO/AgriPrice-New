@echo off
cd /d "%~dp0"

if not exist "backend\.env" (
    echo.
    echo Presentation environment is not configured.
    echo Run setup-presentation.cmd first.
    echo.
    pause
    exit /b 1
)

if not exist "frontend-farmer\.env" (
    echo.
    echo Farmer presentation environment is missing.
    echo Run setup-presentation.cmd first.
    echo.
    pause
    exit /b 1
)

if not exist "frontend-mao\.env" (
    echo.
    echo MAO presentation environment is missing.
    echo Run setup-presentation.cmd first.
    echo.
    pause
    exit /b 1
)

if not exist "frontend-admin\.env" (
    echo.
    echo Admin presentation environment is missing.
    echo Run setup-presentation.cmd first.
    echo.
    pause
    exit /b 1
)

echo ==========================================
echo Starting AgriPrice Presentation
echo ==========================================
echo.
echo Backend: http://localhost:5000
echo Farmer:  http://localhost:4173
echo MAO:     http://localhost:4174
echo Admin:   http://localhost:4175
echo.
echo Close this window to stop all services.
echo.

call npm run dev:all