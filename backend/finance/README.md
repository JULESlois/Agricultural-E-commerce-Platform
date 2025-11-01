# 农业电商平台 - 融资服务模块

## 项目概述

融资服务模块是农业电商平台的核心金融服务组件，为农户提供便捷的融资申请、信用评估、银行审批等服务，同时支持农产品预售融资等创新金融产品。

## 主要功能

### 1. 融资申请管理
- 贷款产品查询
- 融资申请提交
- 申请状态跟踪
- 申请材料上传

### 2. 信用评估系统
- 自动信用评估
- 多维度评分模型
- 信用报告生成
- 评估结果管理

### 3. 银行审批流程
- 待审批申请查询
- 审批结论提交
- 放款确认
- 审批记录管理

### 4. 农产品预售融资
- 预售计划创建
- 买家认购管理
- 定金收取
- 预售进度跟踪

### 5. 灵活还款管理
- 还款计划生成
- 还款计划调整申请
- 银行审批还款调整
- 逾期管理

## 技术栈

- **框架**: Spring Boot 3.2.5
- **数据库**: PostgreSQL
- **ORM**: Spring Data JPA
- **安全**: Spring Security
- **构建工具**: Maven
- **Java版本**: 17

## API接口

### 融资申请相关
- `GET /api/financing/loan-types` - 获取贷款产品列表
- `GET /api/financing/loan-types/{id}` - 获取贷款产品详情
- `POST /api/farmer/financing/applications` - 创建融资申请
- `GET /api/farmer/financing/applications` - 获取我的申请列表

### 银行审批相关
- `GET /api/bank/financing/applications` - 获取待审批申请
- `GET /api/bank/financing/applications/{id}` - 获取申请详情
- `POST /api/bank/financing/applications/{id}/review` - 提交审批结论
- `POST /api/bank/financing/applications/{id}/disburse` - 确认放款

### 预售融资相关
- `POST /api/farmer/presale-plans` - 创建预售计划
- `GET /api/presale-plans` - 查看预售产品
- `POST /api/buyer/presale-subscriptions` - 预售认购

### 内部接口
- `POST /api/internal/financing/applications/{id}/evaluate` - 触发信用评估
- `POST /api/internal/financing/credit-evaluations` - 接收评估结果

## 数据库表结构

### 核心表
1. `financing_loan_type` - 贷款类型配置
2. `financing_application` - 融资申请
3. `financing_bank` - 合作银行信息
4. `financing_credit_evaluation` - 信用评估结果
5. `financing_bank_approval` - 银行审批记录

### 预售相关表
1. `financing_presale_plan` - 预售计划
2. `financing_presale_subscription` - 预售认购
3. `financing_repayment_schedule` - 还款计划
4. `financing_repayment_adjustment_request` - 还款调整申请

## 快速开始

### 1. 环境要求
- JDK 17+
- Maven 3.6+
- PostgreSQL 12+

### 2. 数据库配置
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/agri
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. 运行项目

#### 开发模式（推荐，支持热更新）
```bash
# 使用启动脚本
start-dev.bat

# 或使用Maven命令
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

#### 生产模式
```bash
mvn clean install
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

### 4. 访问接口
项目启动后，可通过以下地址访问：
- 基础URL: http://localhost:8082/finance
- API文档: http://localhost:8082/finance/swagger-ui.html (如果集成了Swagger)
- 热更新状态: http://localhost:8082/finance/api/dev/hotreload/status (仅开发模式)

## 热更新功能 🔥

本项目已集成Spring Boot DevTools热更新功能，大幅提升开发效率！

### 功能特性
- ✅ 自动监控文件变化
- ✅ 快速应用重载
- ✅ LiveReload浏览器自动刷新
- ✅ 手动触发控制
- ✅ 实时状态监控

### 使用方法
1. **启动开发模式**: 运行 `start-dev.bat` 或使用dev profile
2. **修改代码**: 保存Java文件或配置文件后自动重载
3. **查看状态**: 访问 `/api/dev/hotreload/status` 查看热更新状态
4. **手动触发**: 修改 `.reloadtrigger` 文件或调用API

### 热更新API
- `GET /api/dev/hotreload/status` - 查看热更新状态
- `POST /api/dev/hotreload/trigger` - 手动触发重载
- `GET /api/dev/hotreload/config` - 查看配置信息
- `GET /api/dev/hotreload/health` - 健康检查

详细使用指南请参考: [HOT_RELOAD_GUIDE.md](HOT_RELOAD_GUIDE.md)

## 业务流程

### 融资申请流程
1. 农户查看贷款产品列表
2. 选择合适的贷款产品
3. 填写申请信息并上传材料
4. 系统触发信用评估
5. 信用评估通过后转入银行审批
6. 银行审批通过后进行放款

### 预售融资流程
1. 农户创建预售计划
2. 平台审核预售计划
3. 买家认购并支付定金
4. 系统自动生成预售融资申请
5. 按标准流程进行审批和放款

## 注意事项

1. 所有金额字段使用BigDecimal类型，避免精度丢失
2. 敏感信息（如身份证号、银行卡号）需要加密存储
3. 所有API都需要进行用户身份验证
4. 重要操作需要记录操作日志
5. 定期备份数据库数据

## 扩展功能

- [ ] 集成第三方征信系统
- [ ] 支持更多银行接入
- [ ] 风险控制模型优化
- [ ] 移动端支持
- [ ] 实时消息推送