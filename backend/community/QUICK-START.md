# 社区模块快速启动指南

## 前置要求

- Node.js (v14+)
- PostgreSQL (v12+)
- 已配置好的认证服务（用于JWT验证）

## 快速启动步骤

### 1. 安装依赖

```bash
cd backend/community
npm install
```

### 2. 配置环境变量

复制环境变量示例文件：
```bash
copy .env.example .env
```

编辑 `.env` 文件，配置数据库和JWT密钥：
```env
PORT=3003
DB_HOST=82.157.154.143
DB_PORT=5432
DB_USER=agri_root
DB_PASSWORD=agri_root
DB_NAME=agri
JWT_SECRET=your_jwt_secret_key
```

**重要**: 
- 已配置为使用云数据库（82.157.154.143）
- `JWT_SECRET` 必须与认证服务的密钥一致！

### 3. 创建数据库表

在云PostgreSQL数据库中执行 `database-schema-postgres.sql` 文件：

```bash
psql -h 82.157.154.143 -p 5432 -U agri_root -d agri -f database-schema-postgres.sql
```

或者在psql客户端中：
```bash
psql -h 82.157.154.143 -p 5432 -U agri_root -d agri
\i database-schema-postgres.sql
```

**注意**: 使用云数据库时需要确保网络连接正常

### 4. 启动服务

#### 方式一：使用npm脚本（推荐开发环境）
```bash
npm run dev
```

#### 方式二：使用Windows批处理脚本
```bash
start-dev.bat
```

#### 方式三：直接启动
```bash
node index.js
```

### 5. 验证服务

访问健康检查接口：
```bash
curl http://localhost:3003/
```

预期响应：
```json
{
  "message": "Community Service API",
  "status": "running",
  "timestamp": "2025-11-07T..."
}
```

## 测试API

### 获取分类树（无需认证）
```bash
curl http://localhost:3003/api/community/categories/tree
```

### 发布内容（需要认证）
```bash
curl -X POST http://localhost:3003/api/community/content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "category_id": 101,
    "content_type": 1,
    "content_title": "测试标题",
    "content_text": "测试内容",
    "tag_ids": [1]
  }'
```

更多测试示例请参考 `API-TEST-EXAMPLES.md`

## 常见问题

### Q1: 连接数据库失败
**A**: 检查以下几点：
- 网络连接是否正常（云数据库需要外网访问）
- `.env` 中的数据库配置是否正确
  - 主机: 82.157.154.143
  - 端口: 5432
  - 数据库: agri
  - 用户: agri_root
- 防火墙是否允许访问云数据库
- 云数据库是否允许您的IP访问

### Q2: JWT验证失败
**A**: 确保：
- JWT_SECRET与认证服务一致
- Token格式正确：`Bearer {token}`
- Token未过期

### Q3: 端口被占用
**A**: 修改 `.env` 中的 `PORT` 配置，或停止占用3003端口的进程

### Q4: 找不到模块
**A**: 确保已执行 `npm install` 安装所有依赖

## 从backend根目录启动所有服务

如果要同时启动认证、市场和社区服务：

```bash
cd backend
npm run dev
```

这会并发启动所有服务：
- 认证服务: http://localhost:3002
- 市场服务: http://localhost:3001
- 社区服务: http://localhost:3003

## 生产环境部署

### 使用PM2
```bash
cd backend
pm2 start ecosystem.config.js
```

### 查看服务状态
```bash
pm2 status
```

### 查看日志
```bash
pm2 logs community-service
```

## 下一步

1. 阅读 `README.md` 了解详细功能
2. 查看 `API-TEST-EXAMPLES.md` 学习API使用
3. 参考 `DEPENDENCIES.md` 了解依赖说明
4. 查看 `database-schema.sql` 了解数据结构

## 获取帮助

如遇到问题，请检查：
1. 服务日志输出
2. MySQL错误日志
3. 网络连接状态
4. 环境变量配置

祝使用愉快！
