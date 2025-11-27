@echo off
echo ========================================
echo 运行单元测试（排除Controller和集成测试）
echo ========================================
echo.

REM 设置测试环境
set SPRING_PROFILES_ACTIVE=test

echo 正在运行单元测试...
echo.

REM 运行测试，排除Controller和集成测试
mvn test -Dtest=!*ControllerTest,!*IntegrationTest,!*PerformanceTest

echo.
echo ========================================
echo 测试完成！
echo ========================================
echo.

pause
