# PowerShell脚本：合并JUnit XML测试报告

param(
    [string]$ReportsDir = "target/surefire-reports",
    [string]$OutputFile = "target/surefire-reports/TEST-all-tests.xml"
)

Write-Host "============================================================"
Write-Host "JUnit XML测试报告合并工具"
Write-Host "============================================================"
Write-Host "输入目录: $ReportsDir"
Write-Host "输出文件: $OutputFile"
Write-Host "============================================================"
Write-Host ""

# 检查目录是否存在
if (-not (Test-Path $ReportsDir)) {
    Write-Host "错误: 目录 $ReportsDir 不存在" -ForegroundColor Red
    Write-Host "请先运行测试: mvn test"
    exit 1
}

# 获取所有XML文件
$xmlFiles = Get-ChildItem -Path $ReportsDir -Filter "TEST-*.xml" | Where-Object { $_.Name -ne "TEST-all-tests.xml" }

if ($xmlFiles.Count -eq 0) {
    Write-Host "错误: 在 $ReportsDir 中没有找到测试报告文件" -ForegroundColor Red
    exit 1
}

Write-Host "找到 $($xmlFiles.Count) 个测试报告文件"
Write-Host ""

# 创建根元素
$xml = New-Object System.Xml.XmlDocument
$declaration = $xml.CreateXmlDeclaration("1.0", "UTF-8", $null)
[void]$xml.AppendChild($declaration)

$root = $xml.CreateElement("testsuites")
[void]$xml.AppendChild($root)

# 统计信息
$totalTests = 0
$totalFailures = 0
$totalErrors = 0
$totalSkipped = 0
$totalTime = 0.0

# 处理每个XML文件
foreach ($file in $xmlFiles) {
    try {
        $testXml = [xml](Get-Content $file.FullName -Encoding UTF8)
        $testsuite = $testXml.testsuite
        
        # 获取统计信息
        $tests = if ($testsuite.tests) { [int]$testsuite.tests } else { 0 }
        $failures = if ($testsuite.failures) { [int]$testsuite.failures } else { 0 }
        $errors = if ($testsuite.errors) { [int]$testsuite.errors } else { 0 }
        $skipped = if ($testsuite.skipped) { [int]$testsuite.skipped } else { 0 }
        $time = if ($testsuite.time) { [double]$testsuite.time } else { 0.0 }
        
        $totalTests += $tests
        $totalFailures += $failures
        $totalErrors += $errors
        $totalSkipped += $skipped
        $totalTime += $time
        
        # 导入节点
        $importedNode = $xml.ImportNode($testsuite, $true)
        [void]$root.AppendChild($importedNode)
        
        Write-Host "  OK $($file.Name): $tests 个测试, $failures 个失败, $errors 个错误" -ForegroundColor Green
    }
    catch {
        Write-Host "  ERROR 处理 $($file.Name) 时出错: $_" -ForegroundColor Red
    }
}

# 设置根元素属性
$root.SetAttribute("tests", $totalTests.ToString())
$root.SetAttribute("failures", $totalFailures.ToString())
$root.SetAttribute("errors", $totalErrors.ToString())
$root.SetAttribute("skipped", $totalSkipped.ToString())
$root.SetAttribute("time", $totalTime.ToString("F3"))

# 保存文件
try {
    $outputPath = Join-Path (Get-Location) $OutputFile
    $xml.Save($outputPath)
    
    Write-Host ""
    Write-Host "合并完成！" -ForegroundColor Green
    Write-Host "输出文件: $outputPath"
}
catch {
    Write-Host "保存文件失败: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "总计:"
Write-Host "  测试总数: $totalTests"
Write-Host "  失败: $totalFailures"
Write-Host "  错误: $totalErrors"
Write-Host "  跳过: $totalSkipped"
Write-Host "  总时间: $($totalTime.ToString('F3'))秒"

if ($totalTests -gt 0) {
    $successRate = (($totalTests - $totalFailures - $totalErrors) / $totalTests * 100)
    $color = if ($successRate -eq 100) { "Green" } else { "Yellow" }
    Write-Host "  成功率: $($successRate.ToString('F2'))%" -ForegroundColor $color
}
