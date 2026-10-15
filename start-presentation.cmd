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
echo Starting AgriPrice Unified Portal
echo ==========================================
echo.
echo Backend API:     http://localhost:5000
echo Unified Web App: http://localhost:4173
echo.
echo Dedicated Role URLs:
echo   - Landing / Public:  http://localhost:4173/
echo   - Farmer Portal:     http://localhost:4173/farmer (Login: /login)
echo   - MAO Portal:        http://localhost:4173/mao    (Login: /mao/login)
echo   - Admin Portal:      http://localhost:4173/admin  (Login: /admin/login)
echo.
echo Close this window to stop all services.
echo.

call npm run dev:all