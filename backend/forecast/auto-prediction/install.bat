@echo off
chcp 65001 >nul
echo ========================================
echo 安装农产品价格预测自动化服务
echo ========================================
echo.

echo [1/3] 安装 Node.js 依赖...
call npm install
if %errorlevel% neq 0 (
    echo 错误: npm install 失败
    pause
    exit /b 1
)
echo ✓ Node.js 依赖安装完成
echo.

echo [2/3] 初始化数据库...
node init-database.js
if %errorlevel% neq 0 (
    echo 错误: 数据库初始化失败
    pause
    exit /b 1
)
echo ✓ 数据库初始化完成
echo.

echo [3/3] 测试系统...
node test-prediction.js
if %errorlevel% neq 0 (
    echo 警告: 系统测试失败，请检查配置
)
echo.

echo ========================================
echo 安装完成！
echo ========================================
echo.
echo 使用说明:
echo   启动自动预测服务: npm start
echo   手动执行一次预测: npm run predict
echo   测试系统: npm test
echo.
pause
