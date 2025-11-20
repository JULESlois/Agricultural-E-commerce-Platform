@echo off
echo ========================================
echo 合并测试报告
echo ========================================
echo.

REM 检查是否已经运行过测试
if not exist "target\surefire-reports\TEST-*.xml" (
    echo 未找到测试报告，正在运行测试...
    mvn clean test -Dtest="*ServiceTest,*RepositoryTest,*EntityTest,*DtoTest,*ApiResponseTest,HotReloadTest"
    echo.
)

echo 正在合并XML报告...
powershell -ExecutionPolicy Bypass -File Merge-TestReports.ps1

echo.
echo 完成！查看合并后的报告:
echo target\surefire-reports\TEST-all-tests.xml
echo.

pause
