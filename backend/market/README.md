# Market Service

农业平台的市场服务模块

## 安装依赖

```bash
cd backend/market
npm install
```

## 数据库初始化

```bash
# 初始化数据库表结构
npm run db:init
```

## 运行项目

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

## API 端点

### 基础服务
- `GET /` - 服务状态
- `GET /health` - 健康检查（包含数据库连接状态）

### 用户认证
- `POST /api/auth/register` - 用户注册

## 测试

```bash
# 测试用户注册功能
npm run test:register

# 测试输入验证
node test-validation.js

# 验证注册数据
node verify-data.js
```

## 用户注册 API

### POST /api/auth/register

注册新用户（农户或买家）

**请求体:**
```json
{
  "user_name": "nonghu_zhang3",
  "password": "securePassword123", 
  "real_name": "张三",
  "user_type": 1,
  "id_card": "410101199001011234",
  "phone": "13800138000",
  "email": "zhang3@example.com"
}
```

**参数说明:**
- `user_type`: 1=农户, 2=买家
- `id_card`: 身份证号（会被加密存储）
- `email`: 可选字段

**成功响应 (201):**
```json
{
  "code": 201,
  "message": "注册成功，等待管理员审核",
  "data": {
    "user_id": 1001
  }
}
```

**失败响应 (409):**
```json
{
  "code": 409,
  "message": "注册失败",
  "error": "用户名 'nonghu_zhang3' 已存在"
}
```

## 数据库配置

数据库配置在 `dbconfig.json` 文件中，包含：

- 主机: 82.157.154.143
- 端口: 5432
- 数据库: agri
- 用户: agri_root
