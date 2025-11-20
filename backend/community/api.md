第一部分：用户社交关系 API

---
1.1. 关注用户
- 功能: 当前登录用户关注另一个用户。
- HTTP 方法: POST
- Endpoint: /api/community/follows
- 请求 (Input):
  - Headers: Authorization: Bearer {user_token}
  - Body:
    {
  "followed_id": 1002, // 被关注用户的 user_id"follow_source": 1
}
- 响应 (Output):
  - 成功 (HTTP 201 Created):
    {
  "code": 201,
  "message": "关注成功。",
  "data": {
    "follow_id": 1,
    "is_mutual": false // 是否互相关注
  }
}

---
1.2. 取消关注用户
- 功能: 当前登录用户取消对另一个用户的关注。
- HTTP 方法: DELETE
- Endpoint: /api/community/follows/{followed_id}
- 响应 (Output):
  - 成功 (HTTP 204 No Content):
(无响应体)

---
1.3. 获取用户关注列表
- 功能: 查看指定用户正在关注的人的列表。
- HTTP 方法: GET
- Endpoint: /api/community/users/{user_id}/following
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "查询成功。",
  "data": [
    {"user_id": 1002, "user_name": "nonghu_li4", "avatar": "...", "is_mutual": true}
  ]
}

---
1.4. 获取用户粉丝列表
- 功能: 查看指定用户的粉丝列表。
- HTTP 方法: GET
- Endpoint: /api/community/users/{user_id}/followers
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "查询成功。",
  "data": [
    {"user_id": 2001, "user_name": "buyer_wang5", "avatar": "...", "is_mutual": true}
  ]
}

---
1.5. 拉黑用户
- 功能: 将某个用户加入自己的黑名单。
- HTTP 方法: POST
- Endpoint: /api/community/blacklist
- 请求 (Input):
  - Headers: Authorization: Bearer {user_token}
  - Body:
    {
  "blacked_user_id": 3001,
  "black_reason": "恶意评论"
}
- 响应 (Output):
  - 成功 (HTTP 201 Created):
    {
  "code": 201,
  "message": "已将用户加入黑名单。"
}

---
1.6. 移除黑名单
- 功能: 将某个用户从自己的黑名单中移除。
- HTTP 方法: DELETE
- Endpoint: /api/community/blacklist/{blacked_user_id}
- 响应 (Output):
  - 成功 (HTTP 204 No Content):
(无响应体)

---
第二部分：内容分类与标签 API

---
2.1. 获取帖子类别树
- 功能: 获取所有启用的帖子分类，用于发布时选择或按分类浏览。
- HTTP 方法: GET
- Endpoint: /api/community/categories/tree
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "查询成功。",
  "data": [
    {
      "category_id": 1,
      "category_name": "种植技术",
      "children": [
        {"category_id": 101, "category_name": "小麦种植", "children": []}
      ]
    }
  ]
}

---
2.2. 搜索标签
- 功能: 在发布内容时，根据关键词模糊搜索标签。
- HTTP 方法: GET
- Endpoint: /api/community/tags?keyword=小麦
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "查询成功。",
  "data": [
    {"tag_id": 1, "tag_name": "小麦种植"},
    {"tag_id": 5, "tag_name": "冬小麦"}
  ]
}

---
第三部分：核心内容与互动 API

---
3.1. 发布社区内容（帖子）
- 功能: 用户发布一篇新的帖子（经验、问题等）。
- HTTP 方法: POST
- Endpoint: /api/community/content
- 请求 (Input):
  - Headers: Authorization: Bearer {user_token}
  - Body:
    {
  "category_id": 101,
  "content_type": 1,
  "content_title": "2025年冬小麦防寒种植技巧分享",
  "content_text": "<p>大家好，这里分享一些个人总结的技巧...</p>",
  "content_cover": "https://.../cover.jpg",
  "tag_ids": [1, 5] // 关联的标签ID列表
}
- 响应 (Output):
  - 成功 (HTTP 201 Created):
    {
  "code": 201,
  "message": "内容发布成功，等待审核。",
  "data": {
    "content_id": 1001
  }
}

---
3.2. 获取内容列表（Feed流）
- 功能: 获取社区内容列表，支持按分类、最新、最热、推荐等排序。
- HTTP 方法: GET
- Endpoint: /api/community/content?category_id=101&sort=hot
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "查询成功。",
  "data": [
    {
      "content_id": 1001,
      "content_title": "2025年冬小麦防寒种植技巧分享",
      "content_cover": "...",
      "author": {"user_id": 1001, "user_name": "nonghu_zhang3", "avatar": "..."},
      "view_count": 1024,
      "like_count": 128,
      "comment_count": 32
    }
  ]
}

---
3.3. 获取内容详情
- 功能: 查看一篇帖子的完整内容。
- HTTP 方法: GET
- Endpoint: /api/community/content/{content_id}
- 响应 (Output):
  - 成功 (HTTP 200 OK): (返回 community_content 表的完整信息)
    // ... 包含完整的 content_text, author, tags, counts 等信息

---
3.4. 发布评论
- 功能: 对一篇内容或另一条评论进行评论/回复。
- HTTP 方法: POST
- Endpoint: /api/community/content/{content_id}/comments
- 请求 (Input):
  - Headers: Authorization: Bearer {user_token}
  - Body:
    {
  "parent_id": 0, // 0表示对内容评论，非0表示回复某条评论"comment_text": "这个方法很实用，学习了！"
}
- 响应 (Output):
  - 成功 (HTTP 201 Created):
    {
  "code": 201,
  "message": "评论成功。",
  "data": { // 返回新创建的评论对象"comment_id": 2001,
    "user_info": {"user_id": 2001, "user_name": "buyer_wang5"},
    "comment_text": "这个方法很实用，学习了！"
  }
}

---
3.5. 点赞/取消点赞内容
- 功能: 对一篇内容进行点赞或取消点赞。
- HTTP 方法: POST / DELETE
- Endpoint: /api/community/content/{content_id}/like
- 响应 (Output):
  - 成功 (HTTP 200 OK / 204 No Content):
    {
  "code": 200,
  "message": "操作成功。",
  "data": {
    "current_like_count": 129
  }
}

---
3.6. 收藏/取消收藏内容
- 功能: 收藏或取消收藏一篇内容。
- HTTP 方法: POST / DELETE
- Endpoint: /api/community/content/{content_id}/collect
- 响应 (Output):
  - 成功 (HTTP 200 OK / 204 No Content):
    {
  "code": 200,
  "message": "操作成功。",
  "data": {
    "current_collect_count": 50
  }
}

---
第四部分：运营与合规 API

---
4.1. 举报
- 功能: 用户举报违规的内容、评论或用户。
- HTTP 方法: POST
- Endpoint: /api/community/reports
- 请求 (Input):
  - Headers: Authorization: Bearer {user_token}
  - Body:
    {
  "report_type": 1, // 1=内容"report_obj_id": 1002, // 内容ID"report_reason": 2, // 2=广告营销"report_detail": "这篇文章里包含了大量无关的广告链接。",
  "report_evidence": "[\"https://.../evidence.jpg\"]",
  "is_anonymous": true
}
- 响应 (Output):
  - 成功 (HTTP 201 Created):
    {
  "code": 201,
  "message": "举报已提交，平台将尽快处理。"
}

---
4.2. （管理员）获取举报列表
- 功能: 管理员查看待处理的举报。
- HTTP 方法: GET
- Endpoint: /api/admin/community/reports?status=0
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "查询成功。",
  "data": [
    {
      "report_id": 1,
      "report_no": "REP2025110512345678",
      "report_obj_name": "如何快速销售农产品",
      "report_reason": 2,
      "create_time": "..."
    }
  ]
}

---
4.3. （管理员）处理举报并关联违规
- 功能: 管理员审核举报，如果属实，则创建违规记录并进行处理。
- HTTP 方法: POST
- Endpoint: /api/admin/community/reports/{report_id}/handle
- 请求 (Input):
  - Headers: Authorization: Bearer {admin_token}
  - Body:
    {
  "audit_result": "approve", // approve=立案, reject=不立案"audit_remark": "经核查，内容含广告营销，予以立案处理。",
  "violation": { // 如果立案，则提供违规处理信息"handle_measure": 1, // 1=删除内容"handle_remark": "内容含广告，已删除。"
  }
}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "举报处理完成。"
}

---
第五部分：社区问答 API

---
5.1 发布悬赏问题（3.1）
在采纳答案之前，用户需要先发布一个“问题”类型的内容。这个操作属于 community_content 表的 API，但在请求体中会包含与问答相关的字段。
- 功能: 用户发布一个带有悬赏金额的问题。
- HTTP 方法: POST
- Endpoint: /api/community/content
- 请求 (Input):
    {
  "category_id": 301,
  "content_type": 3, // 3 = 问题咨询"content_title": "我的小麦叶子发黄是什么原因，如何防治？",
  "content_text": "如图所示，最近发现部分小麦叶片...",
  "tag_ids": [1, 10],
  "reward_amount": "10.00" // 设置悬赏金额
}
- 响应 (Output):
  - (成功时) 返回新创建的内容 ID，例如 {"content_id": 1005}。

---
5.2. 采纳最佳答案
- 功能: 问题发布者从众多评论中选择一个作为最佳答案。此操作会创建一条 community_qa_relation 记录，并将问题标记为已解决。如果设置了悬赏，会自动触发奖励发放流程。
- HTTP 方法: POST
- Endpoint: /api/community/questions/{content_id}/best-answer
- 请求 (Input):
  - Headers: Authorization: Bearer {question_author_token}
  - Path Param: content_id - 问题的 ID (例如: 1005)
  - Body:
    {
  "comment_id": 2010 // 被采纳为最佳答案的评论 ID
}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "已成功采纳为最佳答案。",
  "data": {
    "qa_id": 1,
    "content_id": 1005,
    "best_comment_id": 2010,
    "qa_status": 1,
    "reward_status": 2, // 2 = 已发放"reward_amount": "10.00",
    "reward_time": "2025-11-10T10:00:00Z"
  }
}
```    *   **失败 (HTTP 403 Forbidden)**:
```json
{
  "code": 403,
  "message": "操作失败。",
  "error": "只有问题发布者才能采纳答案。"
}
  - 失败 (HTTP 404 Not Found):
    {
  "code": 404,
  "message": "操作失败。",
  "error": "指定的评论不存在。"
}

---
5.3.取消最佳答案
- 功能: 问题发布者取消之前选定的最佳答案，使问题重新回到“待解决”状态。此操作通常只在奖励发放失败或有特殊情况下允许。
- HTTP 方法: DELETE
- Endpoint: /api/community/questions/{content_id}/best-answer
- 请求 (Input):
  - Headers: Authorization: Bearer {question_author_token}
  - Path Param: content_id - 问题的 ID
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "已取消最佳答案，问题已重新开放。"
}
  - 失败 (HTTP 400 Bad Request):
    {
  "code": 400,
  "message": "操作失败。",
  "error": "悬赏奖励已发放，无法取消最佳答案。"
}
  - 失败 (HTTP 404 Not Found):
    {
  "code": 404,
  "message": "操作失败。",
  "error": "该问题当前未设置最佳答案。"
}
