@echo off
chcp 65001 >nul
echo ========================================
echo 启动农产品价格自动预测服务
echo ========================================
echo.

node auto-predict.js
