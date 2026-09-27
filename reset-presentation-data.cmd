@echo off
cd /d "%~dp0"

echo ==========================================
echo AgriPrice Presentation Data Reset
echo ==========================================
echo.
echo WARNING:
echo This will completely reset the local
echo agriprice_presentation PostgreSQL database.
echo.
echo It will NOT reset the production Supabase database.
echo.
echo All presentation accounts and dummy data
echo will be recreated from the seed.
echo.

choice /C YN /N /M "Continue? [Y/N]: "

if errorlevel 2 (
    echo.
    echo Reset cancelled.
    pause
    exit /b 0
)

if errorlevel 1 (
    echo.
    echo Resetting presentation database...
    call npm run presentation:reset

    if errorlevel 1 (
        echo.
        echo Database reset failed.
        pause
        exit /b 1
    )

    echo.
    echo ==========================================
    echo Presentation data restored successfully.
    echo ==========================================
    echo.
    echo Demo accounts:
    echo.
    echo Admin:  admin@example.org
    echo MAO:    mao@example.org
    echo Farmer: farmer@example.org
    echo.
    echo Password:
    echo AgriPriceDemo2026!
    echo.
    pause
)