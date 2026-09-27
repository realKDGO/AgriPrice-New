@echo off
setlocal
cd /d "%~dp0"

echo ==========================================
echo AgriPrice Presentation Setup
echo ==========================================
echo.

if not exist "backend\.env" (
    echo Creating backend\.env from presentation template...
    copy /Y "backend\.env.presentation.example" "backend\.env" >nul
)

if not exist "frontend-farmer\.env" (
    echo Creating frontend-farmer\.env from presentation template...
    copy /Y "frontend-farmer\.env.presentation.example" "frontend-farmer\.env" >nul
)

if not exist "frontend-mao\.env" (
    echo Creating frontend-mao\.env from example...
    copy /Y "frontend-mao\.env.example" "frontend-mao\.env" >nul
)

if not exist "frontend-admin\.env" (
    echo Creating frontend-admin\.env from example...
    copy /Y "frontend-admin\.env.example" "frontend-admin\.env" >nul
)

echo.
echo Checking PostgreSQL password configuration...

findstr /C:"CHANGE_YOUR_POSTGRES_PASSWORD" "backend\.env" >nul
if %errorlevel%==0 (
    echo.
    echo SETUP PAUSED
    echo.
    echo Open backend\.env and replace:
    echo.
    echo CHANGE_YOUR_POSTGRES_PASSWORD
    echo.
    echo with the password you selected when installing PostgreSQL.
    echo.
    echo Make sure the PostgreSQL database exists:
    echo agriprice_presentation
    echo.
    start "" notepad "backend\.env"
    pause
    exit /b 1
)

echo.
echo Installing backend dependencies...
call npm install --prefix backend
if errorlevel 1 (
    echo.
    echo Backend installation failed.
    pause
    exit /b 1
)

echo.
echo Installing Farmer frontend dependencies...
call npm install --prefix frontend-farmer
if errorlevel 1 (
    echo.
    echo Farmer frontend installation failed.
    pause
    exit /b 1
)

echo.
echo Installing MAO frontend dependencies...
call npm install --prefix frontend-mao
if errorlevel 1 (
    echo.
    echo MAO frontend installation failed.
    pause
    exit /b 1
)

echo.
echo Installing Admin frontend dependencies...
call npm install --prefix frontend-admin
if errorlevel 1 (
    echo.
    echo Admin frontend installation failed.
    pause
    exit /b 1
)

echo.
echo Generating Prisma client...
call npm run db:generate
if errorlevel 1 (
    echo.
    echo Prisma client generation failed.
    pause
    exit /b 1
)

echo.
echo Applying database migrations...
call npm run db:migrate
if errorlevel 1 (
    echo.
    echo Database migration failed.
    pause
    exit /b 1
)

echo.
echo Seeding presentation data...
call npm run db:seed
if errorlevel 1 (
    echo.
    echo Database seed failed.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo Presentation setup completed.
echo ==========================================
echo.
echo Farmer: http://localhost:4173
echo MAO:    http://localhost:4174
echo Admin:  http://localhost:4175
echo API:    http://localhost:5000
echo.
echo Run start-presentation.cmd to start all services.
echo.
pause