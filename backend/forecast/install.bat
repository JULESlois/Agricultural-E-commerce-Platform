@echo off
echo 正在安装依赖包...
pip install Flask pandas numpy matplotlib scikit-learn tensorflow statsmodels openpyxl
echo.
echo 安装完成！
echo.
echo 运行测试: python test_system.py
echo 启动服务: python app.py
pause
