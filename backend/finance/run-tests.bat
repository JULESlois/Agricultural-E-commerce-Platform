@echo off
echo ========================================
echo 运行金融服务单元测试
echo ========================================
echo.

REM 设置测试环境
set SPRING_PROFILES_ACTIVE=test

echo 正在运行所有单元测试...
echo.

REM 运行测试
mvn clean test

echo.
echo ========================================
echo 测试完成！
echo ========================================
echo.

REM 生成测试报告
echo 生成测试报告...
mvn surefire-report:report

echo.
echo 测试报告已生成: target/site/surefire-report.html
echo.

pause
