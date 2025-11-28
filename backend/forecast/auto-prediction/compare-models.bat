@echo off
chcp 65001 >nul
echo ========================================
echo 对比 ARIMA 和 LSTM 模型预测结果
echo ========================================
echo.

if "%1"=="" (
    node compare-models.js
) else (
    node compare-models.js %1
)

echo.
pause
