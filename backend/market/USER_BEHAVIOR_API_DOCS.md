# 用户行为 API 文档

## 概述
本文档描述了农业电商平台的用户行为相关API接口，包括浏览足迹管理和店铺关注功能。

## API 列表

### 9.1 获取我的浏览足迹

**功能**: 用户查看自己最近浏览过的货源或求购信息。

- **HTTP 方法**: GET
- **Endpoint**: `/api/my/footprints?type=1&page=1&pageSize=20`
- **权限**: 任何已登录用户

**请求头**:
```
Authorization: Bearer {user_token}
```

**查询参数**:
- `type`: 浏览类型 (1=货源, 2=求购) - 必需
- `page`: 页码，默认1
- `pageSize`: 每页数量，默认20，最大100

**响应**:
```json
{
  "code": 200,
  "message": "查询成功。",
  "data": {
    "total": 5,
    "list": [
      {
        "footprint_id": 3001,
        "view_obj_id": 10001,
        "view_obj_name": "2025新产冬小麦（有机认证）",
        "view_time": "2025-10-26T14:30:00Z"
      },
      {
        "footprint_id": 3002,
        "view_obj_id": 10005,
        "view_obj_name": "山东红富士苹果",
        "view_time": "2025-10-26T11:15:00Z"
      }
    ]
  }
}
```

**功能特性**:
- 支持分页查询
- 按浏览时间倒序排列
- 只显示未删除的足迹记录

---

### 9.2 删除浏览足迹

**功能**: 用户从自己的足迹列表中移除一条或多条记录。

- **HTTP 方法**: DELETE
- **Endpoint**: `/api/my/footprints`
- **权限**: 任何已登录用户

**请求头**:
```
Authorization: Bearer {user_token}
```

**请求体**:
```json
{
  "footprint_ids": [3001, 3002]
}
```

**响应**:
- **成功 (HTTP 204 No Content)**: 无响应体

**功能特性**:
- 支持批量删除
- 软删除（标记为已删除，不物理删除）
- 只能删除自己的足迹记录

---

### 9.3 关注一个卖家（店铺）

**功能**: 买家关注一个自己感兴趣的农户卖家。

- **HTTP 方法**: POST
- **Endpoint**: `/api/my/follows`
- **权限**: 买家用户 (userType = 2)

**请求头**:
```
Authorization: Bearer {buyer_token}
```

**请求体**:
```json
{
  "seller_id": 1001,
  "follow_remark": "优质小麦卖家"
}
```

**响应**:
```json
{
  "code": 201,
  "message": "关注成功。",
  "data": {
    "follow_id": 401
  }
}
```

**功能特性**:
- 只有买家用户可以关注卖家
- 防止重复关注同一卖家
- 自动获取卖家信息和货源数量
- 支持重新关注已取消关注的卖家

---

### 9.4 取消关注一个卖家

**功能**: 买家取消对一个卖家的关注。

- **HTTP 方法**: DELETE
- **Endpoint**: `/api/my/follows/{seller_id}`
- **权限**: 买家用户 (userType = 2)

**请求头**:
```
Authorization: Bearer {buyer_token}
```

**路径参数**:
- `seller_id`: 被取消关注的卖家用户ID

**响应**:
- **成功 (HTTP 204 No Content)**: 无响应体

**功能特性**:
- 软删除（更新状态为已取消）
- 记录取消关注时间
- 只能取消关注自己关注的卖家

---

### 9.5 获取我关注的店铺列表

**功能**: 买家查看自己所有关注的卖家店铺列表。

- **HTTP 方法**: GET
- **Endpoint**: `/api/my/follows`
- **权限**: 买家用户 (userType = 2)

**请求头**:
```
Authorization: Bearer {buyer_token}
```

**响应**:
```json
{
  "code": 200,
  "message": "查询成功。",
  "data": [
    {
      "follow_id": 401,
      "seller_id": 1001,
      "seller_name": "张三的有机农场",
      "source_count": 15,
      "avg_score": "4.90",
      "follow_time": "2025-10-25T10:00:00Z"
    }
  ]
}
```

**功能特性**:
- 按关注时间倒序排列
- 显示卖家基本信息和统计数据
- 只显示当前关注状态的卖家

## 数据库表结构

### 用户足迹表 (mall_user_footprint)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| footprint_id | BIGSERIAL | 足迹ID（主键） |
| user_id | BIGINT | 用户ID |
| view_type | SMALLINT | 浏览类型（1=货源, 2=求购, 3=其他） |
| view_obj_id | BIGINT | 浏览对象ID |
| view_obj_name | VARCHAR(100) | 浏览对象名称 |
| view_time | TIMESTAMP | 浏览时间 |
| view_duration | INTEGER | 浏览时长（秒） |
| view_ip | VARCHAR(50) | 浏览IP |
| view_device | VARCHAR(100) | 浏览设备 |
| is_deleted | SMALLINT | 是否删除（0=否, 1=是） |
| delete_time | TIMESTAMP | 删除时间 |

### 用户关注表 (mall_user_follow)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| follow_id | BIGSERIAL | 关注ID（主键） |
| user_id | BIGINT | 用户ID |
| seller_id | BIGINT | 卖家ID |
| follow_time | TIMESTAMP | 关注时间 |
| follow_status | SMALLINT | 关注状态（0=已取消, 1=关注中） |
| cancel_time | TIMESTAMP | 取消时间 |
| seller_name | VARCHAR(100) | 卖家名称 |
| source_count | INTEGER | 货源数量 |
| avg_score | DECIMAL(3,2) | 平均评分 |
| follow_remark | VARCHAR(200) | 关注备注 |

## 错误处理

所有API都包含统一的错误处理机制：

- **400**: 请求参数错误
- **403**: 权限不足（如非买家用户尝试关注）
- **404**: 资源不存在
- **500**: 服务器内部错误

错误响应格式：
```json
{
  "code": 400,
  "message": "错误描述",
  "error": "详细错误信息"
}
```

## 安全特性

1. **权限验证**: 所有接口都需要有效的JWT token
2. **用户类型检查**: 关注功能仅限买家用户使用
3. **数据隔离**: 用户只能操作自己的足迹和关注记录
4. **防重复关注**: 系统自动检查是否已关注同一卖家
5. **数据验证**: 使用Joi进行请求参数验证

## 业务逻辑

### 浏览足迹记录
- 用户浏览货源或求购信息时自动记录
- 支持记录浏览时长、IP地址、设备信息
- 采用软删除机制保护数据

### 店铺关注功能
- 只有买家可以关注卖家
- 关注时自动获取卖家最新信息
- 支持重新关注已取消关注的卖家
- 记录关注和取消关注的时间

## 测试

使用 `test-user-behavior-api.js` 文件可以测试所有用户行为相关API功能。需要先设置有效的token。

```bash
node test-user-behavior-api.js
```

## 扩展功能建议

1. **足迹统计**: 添加用户浏览行为分析
2. **关注通知**: 关注的卖家发布新货源时通知买家
3. **推荐系统**: 基于浏览足迹推荐相关货源
4. **关注分组**: 支持将关注的卖家分组管理