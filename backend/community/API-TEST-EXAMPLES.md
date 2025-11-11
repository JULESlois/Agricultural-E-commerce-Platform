# 社区模块 API 测试示例

## 环境变量
```bash
BASE_URL=http://localhost:3003
TOKEN=your_jwt_token_here
```

## 1. 用户社交关系 API

### 1.1 关注用户
```bash
curl -X POST http://localhost:3003/api/community/follows \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "followed_id": 1002,
    "follow_source": 1
  }'
```

### 1.2 取消关注用户
```bash
curl -X DELETE http://localhost:3003/api/community/follows/1002 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 1.3 获取用户关注列表
```bash
curl -X GET http://localhost:3003/api/community/users/1001/following
```

### 1.4 获取用户粉丝列表
```bash
curl -X GET http://localhost:3003/api/community/users/1001/followers
```

### 1.5 拉黑用户
```bash
curl -X POST http://localhost:3003/api/community/blacklist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "blacked_user_id": 3001,
    "black_reason": "恶意评论"
  }'
```

### 1.6 移除黑名单
```bash
curl -X DELETE http://localhost:3003/api/community/blacklist/3001 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 2. 内容分类与标签 API

### 2.1 获取帖子类别树
```bash
curl -X GET http://localhost:3003/api/community/categories/tree
```

### 2.2 搜索标签
```bash
curl -X GET "http://localhost:3003/api/community/tags?keyword=小麦"
```

## 3. 核心内容与互动 API

### 3.1 发布社区内容
```bash
curl -X POST http://localhost:3003/api/community/content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "category_id": 101,
    "content_type": 1,
    "content_title": "2025年冬小麦防寒种植技巧分享",
    "content_text": "<p>大家好，这里分享一些个人总结的技巧...</p>",
    "content_cover": "https://example.com/cover.jpg",
    "tag_ids": [1, 5]
  }'
```

### 3.2 获取内容列表
```bash
# 获取最新内容
curl -X GET "http://localhost:3003/api/community/content?sort=latest&page=1&limit=20"

# 获取热门内容
curl -X GET "http://localhost:3003/api/community/content?sort=hot&page=1&limit=20"

# 按分类获取
curl -X GET "http://localhost:3003/api/community/content?category_id=101&sort=hot"
```

### 3.3 获取内容详情
```bash
curl -X GET http://localhost:3003/api/community/content/1001
```

### 3.4 发布评论
```bash
# 评论内容
curl -X POST http://localhost:3003/api/community/content/1001/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "parent_id": 0,
    "comment_text": "这个方法很实用，学习了！"
  }'

# 回复评论
curl -X POST http://localhost:3003/api/community/content/1001/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "parent_id": 2001,
    "comment_text": "感谢分享！"
  }'
```

### 3.5 点赞/取消点赞内容
```bash
# 点赞
curl -X POST http://localhost:3003/api/community/content/1001/like \
  -H "Authorization: Bearer YOUR_TOKEN"

# 取消点赞
curl -X DELETE http://localhost:3003/api/community/content/1001/like \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3.6 收藏/取消收藏内容
```bash
# 收藏
curl -X POST http://localhost:3003/api/community/content/1001/collect \
  -H "Authorization: Bearer YOUR_TOKEN"

# 取消收藏
curl -X DELETE http://localhost:3003/api/community/content/1001/collect \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 4. 运营与合规 API

### 4.1 举报
```bash
curl -X POST http://localhost:3003/api/community/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "report_type": 1,
    "report_obj_id": 1002,
    "report_reason": 2,
    "report_detail": "这篇文章里包含了大量无关的广告链接。",
    "report_evidence": "[\"https://example.com/evidence.jpg\"]",
    "is_anonymous": true
  }'
```

### 4.2 (管理员)获取举报列表
```bash
# 获取待处理举报
curl -X GET "http://localhost:3003/api/admin/community/reports?status=0" \
  -H "Authorization: Bearer ADMIN_TOKEN"

# 获取所有举报
curl -X GET "http://localhost:3003/api/admin/community/reports?page=1&limit=20" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 4.3 (管理员)处理举报
```bash
# 立案处理
curl -X POST http://localhost:3003/api/admin/community/reports/1/handle \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "audit_result": "approve",
    "audit_remark": "经核查，内容含广告营销，予以立案处理。",
    "violation": {
      "handle_measure": 1,
      "handle_remark": "内容含广告，已删除。"
    }
  }'

# 不予立案
curl -X POST http://localhost:3003/api/admin/community/reports/1/handle \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "audit_result": "reject",
    "audit_remark": "经核查，内容正常，不予立案。"
  }'
```

## 5. 社区问答 API

### 5.1 发布悬赏问题
```bash
curl -X POST http://localhost:3003/api/community/content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "category_id": 301,
    "content_type": 3,
    "content_title": "我的小麦叶子发黄是什么原因，如何防治？",
    "content_text": "如图所示，最近发现部分小麦叶片...",
    "tag_ids": [1, 10],
    "reward_amount": "10.00"
  }'
```

### 5.2 采纳最佳答案
```bash
curl -X POST http://localhost:3003/api/community/questions/1005/best-answer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "comment_id": 2010
  }'
```

### 5.3 取消最佳答案
```bash
curl -X DELETE http://localhost:3003/api/community/questions/1005/best-answer \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 测试流程建议

1. **准备工作**
   - 确保数据库已创建并导入schema
   - 从认证服务获取有效的JWT token
   - 准备测试用户数据

2. **基础功能测试**
   - 测试分类和标签查询（无需认证）
   - 测试内容列表查询（无需认证）

3. **用户功能测试**
   - 发布内容
   - 评论、点赞、收藏
   - 关注用户

4. **问答功能测试**
   - 发布悬赏问题
   - 回答问题
   - 采纳最佳答案

5. **管理功能测试**
   - 举报内容
   - 管理员审核举报
   - 处理违规内容

## 注意事项

1. 所有需要认证的接口必须携带有效的JWT token
2. 管理员接口需要管理员权限（user_type = 0）
3. 测试前确保相关的用户、分类、标签数据已存在
4. 某些操作有业务逻辑限制（如不能关注自己、不能重复点赞等）
