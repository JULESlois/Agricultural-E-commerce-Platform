@echo off
setlocal enableextensions enabledelayedexpansion
set ROOT=%~dp0..

echo [Smart Agro Chain] Starting backend and frontend services...

echo [Market] starting on http://localhost:3010/
start "market" cmd /c "cd /d %ROOT%\backend\market && set PORT=3010 && npm run start"

echo [Auth] starting on http://localhost:3020/
start "auth" cmd /c "cd /d %ROOT%\backend\auth && set PORT=3020 && npm run start"

echo [Community] starting on http://localhost:3030/
start "community" cmd /c "cd /d %ROOT%\backend\community && set PORT=3030 && npm run start"

echo [Finance] starting on http://localhost:8082/finance/
start "finance" cmd /c "cd /d %ROOT%\backend\finance && set SPRING_PROFILES_ACTIVE=local && mvn spring-boot:run"

echo [Frontend] starting on http://localhost:3000/
start "frontend" cmd /c "cd /d %ROOT%\frontend\smart-main && set VITE_MARKET_BASE=http://localhost:3010/api && set VITE_AUTH_BASE=http://localhost:3020/api && set VITE_COMMUNITY_BASE=http://localhost:3030/api/community && set VITE_FINANCE_BASE=http://localhost:8082/finance/api && npm run dev"

echo All processes launched. Check each window for logs.
echo If ports differ, set environment variables before running.
pause

