# 融资服务模块

## 功能概述
本模块提供农业融资相关的API服务，完全按照API文档要求实现，包括：
- 贷款产品管理
- 融资申请流程
- 信用评估系统
- 银行审批接口
- 预售计划管理

## 技术栈
- Node.js + Express.js
- PostgreSQL + Sequelize ORM
- JWT 身份验证
- Joi 参数校验

## 项目结构
```
finance/
├── config/          # 配置文件
│   ├── db.js        # 数据库配置
│   └── jwt.js       # JWT配置
├── controllers/     # 控制器
│   ├── farmerController.js    # 农户相关接口
│   ├── bankController.js      # 银行相关接口
│   ├── internalController.js  # 内部接口
│   └── presaleController.js   # 预售相关接口
├── models/          # 数据模型
│   ├── applicationModel.js    # 融资申请模型
│   ├── creditModel.js         # 信用评估模型
│   ├── loanModel.js          # 贷款产品模型
│   ├── presaleModel.js       # 预售计划模型
│   └── associations.js       # 模型关联关系
├── routes/          # 路由定义
│   ├── farmerRoutes.js       # 农户路由
│   ├── bankRoutes.js         # 银行路由
│   ├── internalRoutes.js     # 内部路由
│   └── presaleRoutes.js      # 预售路由
├── middleware/      # 中间件
│   └── auth.js      # 身份验证中间件
├── index.js         # 模块入口文件
├── package.json     # 依赖配置
└── README.md        # 说明文档
```

## 安装与运行

### 1. 安装依赖
```bash
npm install
```

### 2. 环境配置
创建 `.env` 文件：
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agri
DB_USER=agri_root
DB_PASSWORD=agri_root

# JWT配置
JWT_SECRET=agri_finance_jwt_secret_2025
JWT_EXPIRES_IN=86400

# 服务端口
BACKEND_PORT=3000
```

### 3. 数据库初始化
执行 `sample-data.sql` 文件初始化数据库表和测试数据。

### 4. 启动服务
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

## API 接口文档（完全符合API文档要求）

### 农户相关接口

#### 1.1 获取贷款产品列表
- **接口**: `GET /api/loan-types`
- **描述**: 获取所有可用的贷款产品列表
- **鉴权**: 无需鉴权
- **响应示例**:
```json
{
  "code": 200,
  "message": "查询成功。",
  "data": [
    {
      "loan_type_id": 1,
      "loan_type_name": "种植周转贷",
      "loan_purpose": "用于购买种子、化肥等农业生产资料",
      "min_loan_amount": 10000.00,
      "max_loan_amount": 100000.00,
      "min_loan_term": 3,
      "max_loan_term": 12,
      "loan_term_type": 2,
      "min_interest_rate": 0.0435
    }
  ]
}
```

#### 1.2 获取贷款产品详情
- **接口**: `GET /api/loan-types/{loan_type_id}`
- **描述**: 获取指定贷款产品的详细信息
- **鉴权**: 无需鉴权
- **参数**: 
  - `loan_type_id`: 贷款类型ID
- **响应**: 返回贷款产品的完整信息

#### 1.3 创建融资申请
- **接口**: `POST /api/farmer/financing/applications`
- **描述**: 农户提交融资申请
- **鉴权**: 需要农户Token (`Authorization: Bearer <token>`)
- **请求体**:
```json
{
  "loan_type_id": 1,
  "apply_amount": 50000.00,
  "apply_term": 6,
  "loan_purpose_detail": "购买种子、化肥等农业生产资料，用于春季玉米种植",
  "repayment_plan": "按月等额本息还款，预计每月还款8500元左右",
  "bank_id": 1,
  "material_urls": [
    "https://example.com/materials/id_card.jpg",
    "https://example.com/materials/land_certificate.pdf"
  ]
}
```
- **成功响应**:
```json
{
  "code": 201,
  "message": "申请已提交，等待平台信用评估。",
  "data": {
    "application_id": 123,
    "application_no": "FIN20241215XXXXXXXX",
    "application_status": 1
  }
}
```

#### 1.4 获取我的融资申请列表
- **接口**: `GET /api/farmer/financing/applications`
- **描述**: 获取当前农户的所有融资申请
- **鉴权**: 需要农户Token
- **响应**: 返回申请列表，包含申请ID、编号、贷款类型、金额、状态等

#### 1.5 获取我的融资申请详情
- **接口**: `GET /api/farmer/financing/applications/{application_id}`
- **描述**: 获取指定融资申请的详细信息
- **鉴权**: 需要农户Token
- **参数**: `application_id` - 申请ID
- **响应**: 返回申请的完整信息，包括审批结果、放款信息等

### 内部接口

#### 2.1 触发信用评估
- **接口**: `POST /api/internal/financing/applications/{application_id}/evaluate`
- **描述**: 触发对指定申请的信用评估
- **鉴权**: 内部接口，无需鉴权
- **参数**: `application_id` - 申请ID
- **响应**:
```json
{
  "code": 202,
  "message": "信用评估任务已启动。"
}
```

#### 2.2 接收评估结果
- **接口**: `POST /api/internal/financing/credit-evaluations`
- **描述**: 接收信用评估系统返回的评估结果
- **鉴权**: 内部接口，无需鉴权
- **请求体**:
```json
{
  "application_id": 123,
  "credit_score": 85,
  "credit_level": "A级",
  "score_detail": {
    "基础信息": 20,
    "经营状况": 25,
    "还款能力": 25,
    "信用记录": 15
  },
  "evaluation_result": 1,
  "evaluation_remark": "信用良好，具备还款能力",
  "credit_report_url": "https://example.com/credit-reports/report_123.pdf"
}
```

### 银行相关接口

#### 3.1 获取待审批的申请列表
- **接口**: `GET /api/bank/financing/applications?status=2`
- **描述**: 获取所有待银行审批的融资申请
- **鉴权**: 需要银行Token (`Authorization: Bearer <token>`)
- **查询参数**: `status=2` (必须为2，表示待银行审批状态)
- **响应**: 返回待审批申请列表，包含申请基本信息和信用分数

#### 3.2 获取申请详情以供审批
- **接口**: `GET /api/bank/financing/applications/{application_id}`
- **描述**: 获取融资申请的完整信息，包括信用评估结果
- **鉴权**: 需要银行Token
- **参数**: `application_id` - 申请ID
- **响应**: 返回申请详情、信用评估信息、用户基础信息

#### 3.3 提交审批结论
- **接口**: `POST /api/bank/financing/applications/{application_id}/review`
- **描述**: 银行提交审批结论
- **鉴权**: 需要银行Token
- **参数**: `application_id` - 申请ID
- **请求体**:
```json
{
  "approval_result": 1,
  "approval_amount": 45000.00,
  "approval_term": 6,
  "interest_rate": 0.0435,
  "approval_remark": "申请材料齐全，信用良好，批准放款"
}
```
- **成功响应**:
```json
{
  "code": 200,
  "message": "审批通过，等待放款。"
}
```

#### 3.4 确认放款
- **接口**: `POST /api/bank/financing/applications/{application_id}/disburse`
- **描述**: 银行确认放款操作
- **鉴权**: 需要银行Token
- **参数**: `application_id` - 申请ID
- **请求体**:
```json
{
  "disburse_amount": 45000.00,
  "disburse_account": "6228480402564890018",
  "disburse_remark": "已成功放款至申请人银行账户"
}
```
- **成功响应**:
```json
{
  "code": 200,
  "message": "放款确认成功。"
}
```

### 预售相关接口

#### 4.1 创建预售计划
- **接口**: `POST /api/farmer/presale/plans`
- **描述**: 农户创建农产品预售计划
- **鉴权**: 需要农户Token
- **请求体**:
```json
{
  "category_id": 1,
  "product_name": "有机玉米",
  "plant_date": "2024-03-15",
  "expected_harvest_date": "2024-09-15",
  "total_yield_quantity": 5000.00,
  "presale_unit_price": 4.50,
  "deposit_ratio": 0.30
}
```

#### 4.2 获取我的预售计划列表
- **接口**: `GET /api/farmer/presale/plans`
- **描述**: 获取当前农户的所有预售计划
- **鉴权**: 需要农户Token

#### 4.3 获取预售计划详情
- **接口**: `GET /api/presale/plans/{plan_id}`
- **描述**: 获取指定预售计划的详细信息
- **鉴权**: 无需鉴权
- **参数**: `plan_id` - 预售计划ID

## 数据库表结构

### 融资申请表 (financing_applications)
包含申请基本信息、审批信息、放款信息等完整字段，支持整个融资流程。

### 信用评估表 (financing_credit_evaluations)
存储信用评估结果，包括分数、等级、详细评分、报告链接等。

### 贷款产品表 (financing_loan_types)
定义各种贷款产品的参数和限制条件。

### 预售计划表 (presale_plans)
管理农产品预售计划信息。

## 申请状态流转

1. **待信用评估** (status=1): 申请刚提交，等待平台进行信用评估
2. **待银行审批** (status=2): 信用评估通过，等待银行审批
3. **审批通过** (status=3): 银行审批通过，等待放款
4. **已放款** (status=4): 银行已完成放款
5. **已驳回** (status=5): 申请被驳回（可能在信用评估或银行审批阶段）

## 测试

运行完整API测试：
```bash
node test-api-comprehensive.js
```

## 注意事项

1. **鉴权要求**: 所有需要鉴权的接口都需要在请求头中携带 `Authorization: Bearer <token>`
2. **状态流转**: 严格按照 1→2→3→4 或 1→5、2→5 的状态流转
3. **数据精度**: 所有金额字段使用 DECIMAL 类型，确保精度
4. **时间格式**: 时间字段统一使用 ISO 8601 格式返回
5. **错误响应**: 统一格式 `{ "code": 错误码, "message": "错误信息" }`
6. **参数校验**: 使用 Joi 进行严格的参数校验
7. **API兼容**: 完全按照提供的API文档实现，确保接口兼容性

## 主要修改内容

根据API文档要求，主要进行了以下修改：

1. **完善银行控制器**: 实现了所有银行相关接口，包括获取待审批列表、申请详情、提交审批结论、确认放款
2. **扩展数据模型**: 在融资申请模型中添加了审批和放款相关字段
3. **新增预售路由**: 创建了预售相关的路由文件
4. **完善参数校验**: 使用Joi对所有接口进行严格的参数校验
5. **统一响应格式**: 确保所有接口的响应格式符合API文档要求
6. **完善错误处理**: 统一错误响应格式和状态码
7. **添加农户申请详情接口**: 实现1.5接口，允许农户查看自己的申请详情
8. **设置模型关联**: 正确设置了各个模型之间的关联关系

所有接口都严格按照API文档的要求实现，确保了完整的功能覆盖和接口兼容性。