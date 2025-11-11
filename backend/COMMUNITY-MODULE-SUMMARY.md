# 社区模块开发总结

## 项目结构

```
backend/community/
├── config/
│   └── database.js          # 数据库连接配置
├── controllers/
│   ├── followController.js  # 关注关系控制器
│   ├── categoryController.js # 分类标签控制器
│   ├── contentController.js # 内容互动控制器
│   ├── reportController.js  # 举报管理控制器
│   └── qaController.js      # 问答控制器
├── middleware/
│   └── auth.js              # 认证中间件
├── routes/
│   ├── follow.js            # 关注路由
│   ├── category.js          # 分类路由
│   ├── content.js           # 内容路由
│   ├── report.js            # 举报路由
│   └── qa.js                # 问答路由
├── .env.example             # 环境变量示例
├── index.js                 # 服务入口
├── package.json             # 依赖配置
├── database-schema.sql      # 数据库结构
├── README.md                # 模块说明
├── DEPENDENCIES.md          # 依赖清单
├── API-TEST-EXAMPLES.md     # API测试示例
└── start-dev.bat            # Windows启动脚本
```

## 已实现的功能模块

### 1. 用户社交关系 (followController.js)
- ✅ 关注用户
- ✅ 取消关注用户
- ✅ 获取用户关注列表
- ✅ 获取用户粉丝列表
- ✅ 拉黑用户
- ✅ 移除黑名单

### 2. 内容分类与标签 (categoryController.js)
- ✅ 获取帖子类别树
- ✅ 搜索标签

### 3. 核心内容与互动 (contentController.js)
- ✅ 发布社区内容（帖子）
- ✅ 获取内容列表（Feed流）
- ✅ 获取内容详情
- ✅ 发布评论
- ✅ 点赞/取消点赞内容
- ✅ 收藏/取消收藏内容

### 4. 运营与合规 (reportController.js)
- ✅ 用户举报
- ✅ 管理员获取举报列表
- ✅ 管理员处理举报并关联违规

### 5. 社区问答 (qaController.js)
- ✅ 发布悬赏问题（通过content接口）
- ✅ 采纳最佳答案
- ✅ 取消最佳答案

## 依赖清单

### 必需的 Node.js 依赖（需安装在 backend 目录）

#### 生产依赖
1. **express** (^4.18.2) - Web框架
2. **mysql2** (^3.6.5) - MySQL数据库驱动
3. **jsonwebtoken** (^9.0.2) - JWT认证
4. **dotenv** (^16.3.1) - 环境变量管理
5. **cors** (^2.8.5) - 跨域资源共享

#### 开发依赖
1. **nodemon** (^3.0.2) - 开发热重载

### 安装命令

```bash
# 进入社区模块目录
cd backend/community

# 安装所有依赖
npm install

# 或者从backend根目录安装所有模块依赖
cd backend
npm run install:all
```

## 数据库表结构

社区模块使用以下12张数据库表：

1. **community_follows** - 关注关系表
2. **community_blacklist** - 黑名单表
3. **community_categories** - 内容分类表
4. **community_tags** - 标签表
5. **community_content** - 内容主表
6. **community_content_tags** - 内容标签关联表
7. **community_comments** - 评论表
8. **community_likes** - 点赞表
9. **community_collects** - 收藏表
10. **community_reports** - 举报表
11. **community_violations** - 违规记录表
12. **community_qa_relation** - 问答关系表

数据库结构详见 `database-schema.sql` 文件。

## 服务配置

### 端口
- 开发环境: 3003
- 生产环境: 3003

### 环境变量 (.env)
```env
PORT=3003
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=agricultural_platform
JWT_SECRET=your_jwt_secret_key
```

## 启动方式

### 单独启动社区服务
```bash
cd backend/community
npm run dev
```

### 启动所有服务（从backend根目录）
```bash
cd backend
npm run dev
```

### 使用PM2启动（生产环境）
```bash
cd backend
pm2 start ecosystem.config.js
```

## API端点总览

### 用户社交 (6个接口)
- POST /api/community/follows
- DELETE /api/community/follows/:followed_id
- GET /api/community/users/:user_id/following
- GET /api/community/users/:user_id/followers
- POST /api/community/blacklist
- DELETE /api/community/blacklist/:blacked_user_id

### 分类标签 (2个接口)
- GET /api/community/categories/tree
- GET /api/community/tags

### 内容互动 (8个接口)
- POST /api/community/content
- GET /api/community/content
- GET /api/community/content/:content_id
- POST /api/community/content/:content_id/comments
- POST /api/community/content/:content_id/like
- DELETE /api/community/content/:content_id/like
- POST /api/community/content/:content_id/collect
- DELETE /api/community/content/:content_id/collect

### 举报管理 (3个接口)
- POST /api/community/reports
- GET /api/admin/community/reports
- POST /api/admin/community/reports/:report_id/handle

### 问答 (2个接口)
- POST /api/community/questions/:content_id/best-answer
- DELETE /api/community/questions/:content_id/best-answer

**总计: 21个API接口**

## 认证与权限

- 普通用户接口: 需要有效的JWT token
- 管理员接口: 需要JWT token且user_type = 0
- 公开接口: 分类查询、标签搜索、内容列表查询等

## 特性

1. **完整的RESTful API设计**
2. **JWT认证保护**
3. **数据库事务支持**
4. **错误处理机制**
5. **请求日志记录**
6. **跨域支持**
7. **环境变量配置**
8. **开发热重载**

## 后续扩展建议

1. 添加内容审核工作流
2. 实现消息通知功能
3. 添加内容推荐算法
4. 实现全文搜索功能
5. 添加用户等级和积分系统
6. 实现图片上传功能
7. 添加敏感词过滤
8. 实现缓存机制（Redis）
9. 添加API限流保护
10. 完善单元测试

## 注意事项

1. JWT_SECRET必须与认证服务保持一致
2. 数据库连接信息需要正确配置
3. 生产环境建议使用PM2或其他进程管理工具
4. 建议配置Nginx反向代理
5. 定期备份数据库
6. 监控服务运行状态
