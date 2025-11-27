package com.example.finance;

import org.junit.platform.suite.api.SelectPackages;
import org.junit.platform.suite.api.Suite;
import org.junit.platform.suite.api.SuiteDisplayName;

/**
 * 金融服务测试套件
 * 运行所有单元测试
 */
@Suite
@SuiteDisplayName("Finance Module Test Suite")
@SelectPackages({
    "com.example.finance.service",
    "com.example.finance.controller",
    "com.example.finance.repository",
    "com.example.finance.entity",
    "com.example.finance.dto"
})
public class FinanceTestSuite {
    // 测试套件类，用于组织和运行所有测试
}
