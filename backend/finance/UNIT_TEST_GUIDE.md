# 单元测试指南

## 概述

本项目使用JUnit 5和Mockito进行完整的单元测试，覆盖了Service层、Controller层、Repository层、Entity层和DTO层。

## 测试结构

```
src/test/java/com/example/finance/
├── controller/          # 控制器测试
│   ├── BankFinancingControllerTest.java
│   ├── FarmerFinancingControllerTest.java
│   ├── FinancingLoanTypeControllerTest.java
│   └── PresaleControllerTest.java
├── service/            # 服务层测试
│   ├── FinancingApplicationServiceTest.java
│   ├── FinancingBankApprovalServiceTest.java
│   ├── FinancingCreditEvaluationServiceTest.java
│   └── FinancingPresaleServiceTest.java
├── repository/         # 数据访问层测试
│   ├── FinancingApplicationRepositoryTest.java
│   └── FinancingPresaleRepositoryTest.java
├── entity/            # 实体类测试
│   ├── FinancingApplicationTest.java
│   ├── FinancingLoanTypeTest.java
│   └── FinancingPresalePlanTest.java
├── dto/               # DTO测试
│   ├── ApiResponseTest.java
│   └── FinancingApplicationCreateRequestTest.java
├── integration/       # 集成测试
│   └── FinancingApplicationIntegrationTest.java
├── hotreload/         # 热更新测试
│   └── HotReloadTest.java
└── FinanceTestSuite.java  # 测试套件
```

## 运行测试

### 方法1: 使用脚本

#### 运行所有测试
```bash
run-tests.bat
```

#### 运行测试并生成覆盖率报告
```bash
run-tests-coverage.bat
```

### 方法2: Maven命令

#### 运行所有测试
```bash
mvn clean test
```

#### 运行特定测试类
```bash
mvn test -Dtest=FinancingApplicationServiceTest
```

#### 运行特定测试方法
```bash
mvn test -Dtest=FinancingApplicationServiceTest#testCreateApplication
```

#### 生成测试报告
```bash
mvn surefire-report:report
```

#### 生成覆盖率报告
```bash
mvn clean test jacoco:report
```

### 方法3: IDE运行

在IntelliJ IDEA或Eclipse中：
- 右键点击测试类或方法
- 选择 "Run Test" 或 "Debug Test"

## 测试覆盖范围

### Service层测试
- ✅ FinancingApplicationService - 融资申请服务
- ✅ FinancingBankApprovalService - 银行审批服务
- ✅ FinancingCreditEvaluationService - 信用评估服务
- ✅ FinancingPresaleService - 预售服务
- ✅ FinancingLoanTypeService - 贷款类型服务

### Controller层测试
- ✅ BankFinancingController - 银行融资控制器
- ✅ FarmerFinancingController - 农户融资控制器
- ✅ PresaleController - 预售控制器
- ✅ FinancingLoanTypeController - 贷款类型控制器

### Repository层测试
- ✅ FinancingApplicationRepository - 融资申请数据访问
- ✅ FinancingPresalePlanRepository - 预售计划数据访问
- ✅ FinancingPresaleSubscriptionRepository - 预售认购数据访问

### Entity层测试
- ✅ FinancingApplication - 融资申请实体
- ✅ FinancingPresalePlan - 预售计划实体
- ✅ FinancingLoanType - 贷款类型实体

### DTO层测试
- ✅ ApiResponse - API响应DTO
- ✅ FinancingApplicationCreateRequest - 融资申请创建请求DTO

## 测试技术栈

### 核心框架
- **JUnit 5** - 测试框架
- **Mockito** - Mock框架
- **Spring Boot Test** - Spring Boot测试支持
- **MockMvc** - Web层测试
- **H2 Database** - 内存数据库（用于测试）

### 测试工具
- **JaCoCo** - 代码覆盖率工具
- **Surefire** - Maven测试插件
- **AssertJ** - 断言库（可选）

## 测试最佳实践

### 1. 测试命名规范
```java
@Test
void testMethodName_Scenario_ExpectedBehavior() {
    // 测试方法命名：test + 方法名 + 场景 + 期望行为
}
```

### 2. AAA模式
```java
@Test
void testExample() {
    // Arrange - 准备测试数据
    User user = new User();
    
    // Act - 执行测试操作
    String result = service.doSomething(user);
    
    // Assert - 验证结果
    assertEquals("expected", result);
}
```

### 3. 使用Mock对象
```java
@Mock
private UserRepository userRepository;

@InjectMocks
private UserService userService;

@Test
void testWithMock() {
    when(userRepository.findById(1L)).thenReturn(Optional.of(user));
    // 测试逻辑
}
```

### 4. 测试边界条件
- 正常情况
- 边界值
- 异常情况
- 空值/null
- 并发情况

### 5. 独立性原则
- 每个测试应该独立运行
- 不依赖其他测试的执行顺序
- 使用@BeforeEach准备测试数据

## 测试报告

### 查看测试报告
测试完成后，可以在以下位置查看报告：

#### Surefire测试报告
```
target/site/surefire-report.html
```

#### JaCoCo覆盖率报告
```
target/site/jacoco/index.html
```

### 报告内容
- 测试执行总数
- 成功/失败/跳过的测试数
- 执行时间
- 代码覆盖率（行覆盖率、分支覆盖率）
- 详细的测试结果

## 覆盖率目标

### 当前覆盖率要求
- **最低要求**: 60%
- **推荐目标**: 80%
- **理想目标**: 90%+

### 覆盖率指标
- **行覆盖率**: 代码行的执行覆盖
- **分支覆盖率**: 条件分支的覆盖
- **方法覆盖率**: 方法的调用覆盖
- **类覆盖率**: 类的使用覆盖

## 持续集成

### CI/CD集成
在CI/CD流程中自动运行测试：

```yaml
# 示例：GitHub Actions
- name: Run Tests
  run: mvn clean test
  
- name: Generate Coverage Report
  run: mvn jacoco:report
  
- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## 常见问题

### 1. 测试失败
- 检查测试数据是否正确
- 验证Mock对象的行为设置
- 查看详细的错误信息

### 2. 覆盖率不足
- 添加更多测试用例
- 测试边界条件和异常情况
- 覆盖所有分支路径

### 3. 测试运行缓慢
- 使用内存数据库
- 减少不必要的集成测试
- 优化测试数据准备

### 4. Mock对象不工作
- 确认使用@ExtendWith(MockitoExtension.class)
- 检查@Mock和@InjectMocks注解
- 验证when().thenReturn()设置

## 测试数据管理

### 测试数据生成器
使用TestDataGenerator工具类生成测试数据：

```java
@Autowired
private TestDataGenerator testDataGenerator;

@Test
void testWithGeneratedData() {
    FinancingApplication app = testDataGenerator.createTestApplication();
    // 使用生成的测试数据
}
```

### 测试配置
测试环境配置文件：`src/test/resources/application-test.properties`

```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=false
```

## 下一步

1. **提高覆盖率**: 为未覆盖的代码添加测试
2. **性能测试**: 添加性能基准测试
3. **集成测试**: 扩展端到端集成测试
4. **压力测试**: 添加并发和负载测试

## 参考资源

- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [Spring Boot Testing](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing)
- [JaCoCo Documentation](https://www.jacoco.org/jacoco/trunk/doc/)

---

**测试是保证代码质量的关键！** 🧪✅
