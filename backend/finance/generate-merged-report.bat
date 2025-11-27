@echo off
echo ========================================
echo 生成合并的测试报告
echo ========================================
echo.

echo 步骤1: 运行测试...
mvn clean test -Dtest="*ServiceTest,*RepositoryTest,*EntityTest,*DtoTest,*ApiResponseTest,HotReloadTest"

if %ERRORLEVEL% NEQ 0 (
    echo 测试执行失败，但继续生成报告...
)

echo.
echo 步骤2: 合并XML报告...
python merge-test-reports.py

if %ERRORLEVEL% NEQ 0 (
    echo Python脚本执行失败，尝试使用python3...
    python3 merge-test-reports.py
)

echo.
echo 步骤3: 生成HTML报告...
mvn surefire-report:report

echo.
echo 步骤4: 生成覆盖率报告...
mvn jacoco:report

echo.
echo ========================================
echo 报告生成完成！
echo ========================================
echo.
echo 报告位置:
echo - 合并的XML报告: target\surefire-reports\TEST-all-tests.xml
echo - HTML测试报告: target\site\surefire-report.html
echo - JaCoCo覆盖率: target\site\jacoco\index.html
echo - 单个XML报告: target\surefire-reports\TEST-*.xml
echo.

pause
