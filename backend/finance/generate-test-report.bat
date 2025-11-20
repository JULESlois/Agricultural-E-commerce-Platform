@echo off
echo ========================================
echo 生成测试汇总报告
echo ========================================
echo.

echo 步骤1: 运行测试...
mvn clean test -Dtest="*ServiceTest,*RepositoryTest,*EntityTest,*DtoTest,*ApiResponseTest,HotReloadTest"

echo.
echo 步骤2: 生成HTML报告...
mvn surefire-report:report

echo.
echo 步骤3: 生成覆盖率报告...
mvn jacoco:report

echo.
echo ========================================
echo 报告生成完成！
echo ========================================
echo.
echo 报告位置:
echo - HTML测试报告: target\site\surefire-report.html
echo - JaCoCo覆盖率: target\site\jacoco\index.html
echo - XML测试结果: target\surefire-reports\
echo.

pause
