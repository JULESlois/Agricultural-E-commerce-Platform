@echo off
echo Starting Agricultural E-commerce Backend Services...

start "Auth Service" cmd /k "cd auth && npm run dev"
start "Market Service" cmd /k "cd market && npm run dev"

echo All services started!
pause