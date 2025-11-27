#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
合并所有JUnit XML测试报告为一个总的XML文件
"""

import os
import xml.etree.ElementTree as ET
from pathlib import Path
import sys

def merge_junit_xml_reports(reports_dir, output_file):
    """
    合并所有JUnit XML报告
    
    Args:
        reports_dir: 包含XML报告的目录
        output_file: 输出的合并XML文件路径
    """
    # 创建根元素
    root = ET.Element('testsuites')
    
    total_tests = 0
    total_failures = 0
    total_errors = 0
    total_skipped = 0
    total_time = 0.0
    
    # 遍历所有XML文件
    reports_path = Path(reports_dir)
    xml_files = list(reports_path.glob('TEST-*.xml'))
    
    if not xml_files:
        print(f"错误: 在 {reports_dir} 中没有找到测试报告文件")
        return False
    
    print(f"找到 {len(xml_files)} 个测试报告文件")
    
    for xml_file in xml_files:
        try:
            tree = ET.parse(xml_file)
            testsuite = tree.getroot()
            
            # 获取测试套件的统计信息
            tests = int(testsuite.get('tests', 0))
            failures = int(testsuite.get('failures', 0))
            errors = int(testsuite.get('errors', 0))
            skipped = int(testsuite.get('skipped', 0))
            time = float(testsuite.get('time', 0))
            
            total_tests += tests
            total_failures += failures
            total_errors += errors
            total_skipped += skipped
            total_time += time
            
            # 添加到根元素
            root.append(testsuite)
            
            print(f"  ✓ {xml_file.name}: {tests}个测试, {failures}个失败, {errors}个错误")
            
        except Exception as e:
            print(f"  ✗ 处理 {xml_file.name} 时出错: {e}")
            continue
    
    # 设置根元素的属性
    root.set('tests', str(total_tests))
    root.set('failures', str(total_failures))
    root.set('errors', str(total_errors))
    root.set('skipped', str(total_skipped))
    root.set('time', f'{total_time:.3f}')
    
    # 写入输出文件
    tree = ET.ElementTree(root)
    ET.indent(tree, space='  ')  # Python 3.9+
    tree.write(output_file, encoding='utf-8', xml_declaration=True)
    
    print(f"\n合并完成！")
    print(f"输出文件: {output_file}")
    print(f"\n总计:")
    print(f"  测试总数: {total_tests}")
    print(f"  失败: {total_failures}")
    print(f"  错误: {total_errors}")
    print(f"  跳过: {total_skipped}")
    print(f"  总时间: {total_time:.3f}秒")
    print(f"  成功率: {((total_tests - total_failures - total_errors) / total_tests * 100):.2f}%")
    
    return True

def main():
    # 默认路径
    reports_dir = 'target/surefire-reports'
    output_file = 'target/surefire-reports/TEST-all-tests.xml'
    
    # 检查参数
    if len(sys.argv) > 1:
        reports_dir = sys.argv[1]
    if len(sys.argv) > 2:
        output_file = sys.argv[2]
    
    print("=" * 60)
    print("JUnit XML测试报告合并工具")
    print("=" * 60)
    print(f"输入目录: {reports_dir}")
    print(f"输出文件: {output_file}")
    print("=" * 60)
    print()
    
    # 检查目录是否存在
    if not os.path.exists(reports_dir):
        print(f"错误: 目录 {reports_dir} 不存在")
        print("请先运行测试: mvn test")
        return 1
    
    # 合并报告
    success = merge_junit_xml_reports(reports_dir, output_file)
    
    return 0 if success else 1

if __name__ == '__main__':
    sys.exit(main())
