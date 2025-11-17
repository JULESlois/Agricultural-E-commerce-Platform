@echo off
echo Starting Community Service...
echo.

REM 检查是否安装了依赖
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM 检查.env文件
if not exist ".env" (
    echo Warning: .env file not found!
    echo Please copy .env.example to .env and configure it.
    echo.
    pause
    exit /b 1
)

REM 启动服务
echo Starting service on port 3003...
npm run dev
