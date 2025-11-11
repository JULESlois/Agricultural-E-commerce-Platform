# 社区模块 (Community Service)

农业电商平台的社区服务模块，提供用户社交、内容发布、问答等功能。

## 端口
- 开发环境: 3003
- 生产环境: 3003

## 功能模块

### 1. 用户社交关系
- 关注/取消关注用户
- 获取关注列表和粉丝列表
- 黑名单管理

### 2. 内容分类与标签
- 获取帖子类别树
- 标签搜索

### 3. 核心内容与互动
- 发布社区内容（帖子）
- 获取内容列表（Feed流）
- 获取内容详情
- 发布评论
- 点赞/取消点赞
- 收藏/取消收藏

### 4. 运营与合规
- 用户举报
- 管理员审核举报
- 违规处理

### 5. 社区问答
- 发布悬赏问题
- 采纳最佳答案
- 取消最佳答案

## 安装依赖

```bash
cd backend/community
npm install
```

## 环境配置

复制 `.env.example` 为 `.env` 并配置：

```env
PORT=3003
DB_HOST=82.157.154.143
DB_PORT=5432
DB_USER=agri_root
DB_PASSWORD=agri_root
DB_NAME=agri
JWT_SECRET=your_jwt_secret_key
```

## 启动服务

开发模式：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

## API 文档

详细的API文档请参考项目根目录的 `API文档（用户社区）.md`

## 依赖清单

### 生产依赖
- `express`: ^4.18.2 - Web框架
- `pg`: ^8.11.3 - PostgreSQL数据库驱动
- `jsonwebtoken`: ^9.0.2 - JWT认证
- `dotenv`: ^16.3.1 - 环境变量管理
- `cors`: ^2.8.5 - 跨域资源共享

### 开发依赖
- `nodemon`: ^3.0.2 - 开发热重载

## 数据库表

社区模块使用以下数据库表：
- `community_follows` - 关注关系
- `community_blacklist` - 黑名单
- `community_categories` - 内容分类
- `community_tags` - 标签
- `community_content` - 内容主表
- `community_content_tags` - 内容标签关联
- `community_comments` - 评论
- `community_likes` - 点赞
- `community_collects` - 收藏
- `community_reports` - 举报
- `community_violations` - 违规记录
- `community_qa_relation` - 问答关系

详细的数据库结构请参考 `database-schema.sql`

## 注意事项

1. 所有需要认证的接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. 管理员接口需要用户类型为 0（管理员）
3. 内容发布后默认需要审核（audit_status = 0）
4. 悬赏问题的奖励发放需要与财务模块集成
