@echo off
echo ========================================
echo 运行金融服务单元测试（含代码覆盖率）
echo ========================================
echo.

REM 设置测试环境
set SPRING_PROFILES_ACTIVE=test

echo 正在运行测试并生成覆盖率报告...
echo.

REM 运行测试并生成覆盖率报告
mvn clean test jacoco:report

echo.
echo ========================================
echo 测试完成！
echo ========================================
echo.

echo 测试报告: target/site/surefire-report.html
echo 覆盖率报告: target/site/jacoco/index.html
echo.

pause
