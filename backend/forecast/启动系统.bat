@echo off
echo ========================================
echo 农产品价格预测系统 - 启动脚本
echo ========================================
echo.

cd backend/forecast
echo [1/2] 启动后端服务...
start "后端服务" cmd /k "python app.py"
timeout /t 3 /nobreak >nul

echo [2/2] 启动前端服务...
cd frontend/forecast
start "前端服务" cmd /k "npm start"

echo.
echo ========================================
echo 系统启动完成！
echo.
echo 后端地址: http://localhost:5000
echo 前端地址: http://localhost:3000
echo.
echo 按任意键关闭此窗口...
echo ========================================
pause >nul
