@echo off
setlocal enabledelayedexpansion

echo ==============================
echo  STARTING DEV ENV (COMBINED LOG)
echo ==============================

REM Config
set FRONTEND_PORT=5173
set BACKEND_PORT=8080

REM -------------------------------
REM Start Backend (Spring Boot)
REM -------------------------------
echo ▶ Starting Spring Boot backend...
start "Backend" cmd /k "cd backend && call mvnw.cmd spring-boot:run"

REM -------------------------------
REM Start Frontend (React / Vite)
REM -------------------------------
echo ▶ Starting React frontend...
start "Frontend" cmd /k "cd frontend && call npm install && npm run dev"

REM -------------------------------
REM Wait a few seconds and open browser
REM -------------------------------
timeout /t 5 >nul
echo ▶ Opening browser at http://localhost:%FRONTEND_PORT%
start http://localhost:%FRONTEND_PORT%

echo ==============================
echo  DEV ENV STARTED
echo ==============================
echo Press CTRL+C in this window to terminate all processes manually if needed
pause
