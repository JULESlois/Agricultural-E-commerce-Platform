@echo off
chcp 65001 >nul
echo ========================================
echo 查看农产品价格预测结果
echo ========================================
echo.

node query-predictions.js

echo.
pause
