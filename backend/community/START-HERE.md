# 🚀 社区模块启动指南

## 📋 前提条件

- ✅ Node.js (v14+)
- ✅ 云数据库已配置（82.157.154.143）
- ✅ 网络连接正常

## ⚡ 快速启动（3步）

### 1️⃣ 安装依赖

```bash
cd backend/community
npm install
```

### 2️⃣ 测试数据库连接

```bash
npm run test:db
```

**预期输出**:
```
=================================
测试云数据库连接
=================================
主机: 82.157.154.143
端口: 5432
数据库: agri
用户: agri_root
=================================

正在连接数据库...
✓ 数据库连接成功！

执行测试查询...
✓ 查询成功！
PostgreSQL 版本: PostgreSQL 12.x...

检查社区模块表...
✓ 找到 12 个社区模块表:
  - community_blacklist
  - community_categories
  - community_collects
  - community_comments
  - community_content
  - community_content_tags
  - community_follows
  - community_likes
  - community_qa_relation
  - community_reports
  - community_tags
  - community_violations

检查示例数据...
✓ 分类数量: 7
✓ 标签数量: 5

=================================
✓ 所有测试通过！
=================================
```

### 3️⃣ 启动服务

```bash
npm run dev
```

**预期输出**:
```
[nodemon] starting `node index.js`
PostgreSQL connected
Community service running on port 3003
```

## ✅ 验证服务

### 测试健康检查
```bash
curl http://localhost:3003/
```

**预期响应**:
```json
{
  "message": "Community Service API",
  "status": "running",
  "timestamp": "2025-11-07T..."
}
```

### 测试分类接口
```bash
curl http://localhost:3003/api/community/categories/tree
```

**预期响应**:
```json
{
  "code": 200,
  "message": "查询成功。",
  "data": [
    {
      "category_id": 1,
      "category_name": "种植技术",
      "children": [...]
    }
  ]
}
```

## 🔧 配置说明

### 环境变量 (.env)

已自动配置云数据库：

```env
PORT=3003
DB_HOST=82.157.154.143
DB_PORT=5432
DB_USER=agri_root
DB_PASSWORD=agri_root
DB_NAME=agri
JWT_SECRET=your_jwt_secret_key
```

⚠️ **重要**: 请确保 `JWT_SECRET` 与认证服务保持一致！

## 📊 数据库表结构

社区模块包含 **12张表**：

| 表名 | 说明 |
|------|------|
| community_follows | 关注关系 |
| community_blacklist | 黑名单 |
| community_categories | 内容分类 |
| community_tags | 标签 |
| community_content | 内容主表 |
| community_content_tags | 内容标签关联 |
| community_comments | 评论 |
| community_likes | 点赞 |
| community_collects | 收藏 |
| community_reports | 举报 |
| community_violations | 违规记录 |
| community_qa_relation | 问答关系 |

## 🔍 初始化数据库（如需要）

如果测试连接时提示"未找到社区模块表"，执行：

```bash
psql -h 82.157.154.143 -p 5432 -U agri_root -d agri -f database-schema-postgres.sql
```

输入密码: `agri_root`

## 📚 API 接口

### 用户社交 (6个)
- POST `/api/community/follows` - 关注用户
- DELETE `/api/community/follows/:id` - 取消关注
- GET `/api/community/users/:id/following` - 关注列表
- GET `/api/community/users/:id/followers` - 粉丝列表
- POST `/api/community/blacklist` - 拉黑用户
- DELETE `/api/community/blacklist/:id` - 移除黑名单

### 分类标签 (2个)
- GET `/api/community/categories/tree` - 分类树
- GET `/api/community/tags?keyword=xxx` - 搜索标签

### 内容互动 (8个)
- POST `/api/community/content` - 发布内容
- GET `/api/community/content` - 内容列表
- GET `/api/community/content/:id` - 内容详情
- POST `/api/community/content/:id/comments` - 发布评论
- POST `/api/community/content/:id/like` - 点赞
- DELETE `/api/community/content/:id/like` - 取消点赞
- POST `/api/community/content/:id/collect` - 收藏
- DELETE `/api/community/content/:id/collect` - 取消收藏

### 举报管理 (3个)
- POST `/api/community/reports` - 提交举报
- GET `/api/admin/community/reports` - 举报列表（管理员）
- POST `/api/admin/community/reports/:id/handle` - 处理举报（管理员）

### 问答 (2个)
- POST `/api/community/questions/:id/best-answer` - 采纳答案
- DELETE `/api/community/questions/:id/best-answer` - 取消答案

**总计: 21个API接口**

## 🛠️ 常用命令

```bash
# 开发模式（热重载）
npm run dev

# 生产模式
npm start

# 测试数据库连接
npm run test:db

# 安装依赖
npm install

# 查看日志
# 开发模式会自动显示日志
```

## ❓ 常见问题

### Q1: 连接数据库失败
**检查清单**:
- [ ] 网络连接正常
- [ ] .env 文件存在且配置正确
- [ ] 防火墙未阻止连接
- [ ] 云数据库服务正常

**解决方案**:
```bash
# 测试网络连通性
ping 82.157.154.143

# 测试端口
Test-NetConnection -ComputerName 82.157.154.143 -Port 5432
```

### Q2: 找不到表
**原因**: 数据库表未创建

**解决方案**:
```bash
psql -h 82.157.154.143 -p 5432 -U agri_root -d agri -f database-schema-postgres.sql
```

### Q3: JWT 验证失败
**原因**: JWT_SECRET 不一致

**解决方案**:
确保 `.env` 中的 `JWT_SECRET` 与认证服务一致

### Q4: 端口被占用
**解决方案**:
修改 `.env` 中的 `PORT` 为其他端口（如 3004）

## 📖 详细文档

- [CLOUD-DATABASE-SETUP.md](./CLOUD-DATABASE-SETUP.md) - 云数据库配置详解
- [API-TEST-EXAMPLES.md](./API-TEST-EXAMPLES.md) - API 测试示例
- [POSTGRESQL-SETUP.md](./POSTGRESQL-SETUP.md) - PostgreSQL 设置指南
- [README.md](./README.md) - 完整说明文档

## 🎯 下一步

1. ✅ 启动服务成功
2. 📝 查看 [API-TEST-EXAMPLES.md](./API-TEST-EXAMPLES.md) 学习API使用
3. 🔧 根据需求调整配置
4. 🚀 开始开发

## 💡 提示

- 开发时使用 `npm run dev` 可以自动重启
- 修改代码后会自动重新加载
- 查看控制台日志了解请求详情
- 使用 Postman 或 curl 测试 API

---

**祝开发顺利！** 🎉
