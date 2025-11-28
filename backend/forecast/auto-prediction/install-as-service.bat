@echo off
chcp 65001 >nul

:: 检查管理员权限
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 需要管理员权限
    echo 请右键点击此文件，选择"以管理员身份运行"
    pause
    exit /b 1
)

echo ========================================
echo 安装农产品价格预测服务为 Windows 服务
echo ========================================
echo.

echo [1/2] 安装 node-windows...
call npm install -g node-windows
if %errorlevel% neq 0 (
    echo 错误: node-windows 安装失败
    pause
    exit /b 1
)

echo.
echo [2/2] 安装服务...
node install-service.js

echo.
echo ========================================
echo 安装完成！
echo ========================================
echo.
echo 服务管理命令:
echo   启动服务: net start AgriPricePrediction
echo   停止服务: net stop AgriPricePrediction
echo   查看状态: sc query AgriPricePrediction
echo   卸载服务: node uninstall-service.js
echo.
pause
