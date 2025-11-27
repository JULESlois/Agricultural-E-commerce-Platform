@echo off
cd /d f:\C\VUE\Agricultural-E-commerce-Platform-main\backend\forecast

echo 开始清除Python缓存...

rem 删除所有__pycache__目录
for /d /r . %%d in (__pycache__) do (
    if exist "%%d" (
        echo 删除目录: %%d
        rd /s /q "%%d"
    )
)

rem 删除所有Python字节码文件
for /r . %%f in (*.pyc *.pyo *.pyd) do (
    if exist "%%f" (
        echo 删除文件: %%f
        del /f "%%f"
    )
)

echo 缓存清除完成！
pause